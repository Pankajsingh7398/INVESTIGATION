'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Case,
  Evidence,
  Entity,
  TimelineEvent,
  GraphData,
  AIQueryResponse,
  EvidenceProcessingStatus,
  UserProfile
} from '@/types/forensics';
import { forensicsApi } from '@/lib/api/client';
import { DEMO_CASE_102 } from '@/lib/mock/case102';
import { PRESET_USERS } from '@/lib/mock/auth';

interface ForensicsContextType {
  currentUser: UserProfile;
  activeCase: Case | null;
  cases: Case[];
  evidenceList: Evidence[];
  entitiesList: Entity[];
  timelineEvents: TimelineEvent[];
  graphData: GraphData;
  isLoading: boolean;
  selectedEvidence: Evidence | null;
  setSelectedEvidence: (evidence: Evidence | null) => void;
  loadDemoInvestigation: () => Promise<void>;
  setActiveCaseId: (caseId: string) => void;
  createNewCase: (data: Partial<Case>) => Promise<Case>;
  uploadNewEvidence: (file: { name: string; size: string; type: Evidence['file_type']; rawSha256?: string }) => Promise<Evidence>;
  queryAssistant: (question: string) => Promise<AIQueryResponse>;
  refreshActiveCaseData: () => Promise<void>;
  simulateProcessingPipeline: (evidenceId: string) => void;
  switchRole: (roleKey: 'investigator' | 'analyst' | 'auditor') => void;
  login: (presetKeyOrEmail: string) => void;
  logout: () => void;
}

const ForensicsContext = createContext<ForensicsContextType | undefined>(undefined);

export function ForensicsProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS.investigator);
  const [cases, setCases] = useState<Case[]>([DEMO_CASE_102]);
  const [activeCase, setActiveCase] = useState<Case | null>(DEMO_CASE_102);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [entitiesList, setEntitiesList] = useState<Entity[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('evidencegraph_user_role');
      if (saved && PRESET_USERS[saved]) {
        setCurrentUser(PRESET_USERS[saved]);
      }
    }
  }, []);

  const switchRole = (roleKey: 'investigator' | 'analyst' | 'auditor') => {
    if (PRESET_USERS[roleKey]) {
      setCurrentUser(PRESET_USERS[roleKey]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('evidencegraph_user_role', roleKey);
      }
    }
  };

  const login = (roleOrEmail: string) => {
    const term = roleOrEmail.toLowerCase().trim();
    if (term.includes('analyst') || term.includes('khushboo') || term.includes('cfsl')) {
      switchRole('analyst');
    } else if (term.includes('auditor') || term.includes('narayanan') || term.includes('judge') || term.includes('court')) {
      switchRole('auditor');
    } else {
      switchRole('investigator');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evidencegraph_user_role');
    }
    setCurrentUser(PRESET_USERS.investigator);
  };

  const refreshActiveCaseData = async () => {
    if (!activeCase) return;
    setIsLoading(true);
    try {
      const [evList, entList, timeList, grData] = await Promise.all([
        forensicsApi.getEvidenceForCase(activeCase.case_id),
        forensicsApi.getEntitiesForCase(activeCase.case_id),
        forensicsApi.getTimelineForCase(activeCase.case_id),
        forensicsApi.getGraphForCase(activeCase.case_id)
      ]);
      setEvidenceList(evList);
      setEntitiesList(entList);
      setTimelineEvents(timeList);
      setGraphData(grData);
    } catch (err) {
      console.error('Failed to refresh case data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const allCases = await forensicsApi.getCases();
      setCases(allCases);
      if (allCases.length > 0) {
        const defaultCase = allCases.find(c => c.case_id === 'CASE-102') || allCases[0];
        setActiveCase(defaultCase);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (activeCase) {
      refreshActiveCaseData();
    }
  }, [activeCase?.case_id]);

  const loadDemoInvestigation = async () => {
    setIsLoading(true);
    const loaded = await forensicsApi.loadDemoCase();
    const allCases = await forensicsApi.getCases();
    setCases(allCases);
    setActiveCase(loaded);
    await refreshActiveCaseData();
  };

  const setActiveCaseId = async (caseId: string) => {
    const found = await forensicsApi.getCaseById(caseId);
    if (found) {
      setActiveCase(found);
    }
  };

  const createNewCase = async (data: Partial<Case>): Promise<Case> => {
    const created = await forensicsApi.createCase(data);
    const all = await forensicsApi.getCases();
    setCases(all);
    setActiveCase(created);
    return created;
  };

  const simulateProcessingPipeline = (evidenceId: string) => {
    const stages: Array<{ status: EvidenceProcessingStatus; progress: number; delay: number }> = [
      { status: 'PROCESSING', progress: 30, delay: 1200 },
      { status: 'TEXT_EXTRACTED', progress: 55, delay: 2400 },
      { status: 'ENTITIES_EXTRACTED', progress: 75, delay: 3800 },
      { status: 'RELATIONSHIPS_GENERATED', progress: 90, delay: 5200 },
      { status: 'COMPLETED', progress: 100, delay: 6500 }
    ];

    stages.forEach(({ status, progress, delay }) => {
      setTimeout(() => {
        forensicsApi.updateEvidenceStatus(evidenceId, status, progress);
        setEvidenceList(prev =>
          prev.map(item =>
            item.evidence_id === evidenceId
              ? { ...item, status, progress_percent: progress }
              : item
          )
        );
      }, delay);
    });
  };

  const uploadNewEvidence = async (file: {
    name: string;
    size: string;
    type: Evidence['file_type'];
    rawSha256?: string;
  }): Promise<Evidence> => {
    if (!activeCase) throw new Error('No active case');
    const created = await forensicsApi.uploadEvidence(activeCase.case_id, file);
    setEvidenceList(prev => [created, ...prev]);
    simulateProcessingPipeline(created.evidence_id);
    return created;
  };

  const queryAssistant = async (question: string): Promise<AIQueryResponse> => {
    if (!activeCase) throw new Error('No active case');
    return await forensicsApi.askAssistant(activeCase.case_id, question);
  };

  return (
    <ForensicsContext.Provider
      value={{
        currentUser,
        activeCase,
        cases,
        evidenceList,
        entitiesList,
        timelineEvents,
        graphData,
        isLoading,
        selectedEvidence,
        setSelectedEvidence,
        loadDemoInvestigation,
        setActiveCaseId,
        createNewCase,
        uploadNewEvidence,
        queryAssistant,
        refreshActiveCaseData,
        simulateProcessingPipeline,
        switchRole,
        login,
        logout
      }}
    >
      {children}
    </ForensicsContext.Provider>
  );
}

export function useForensics() {
  const context = useContext(ForensicsContext);
  if (!context) {
    throw new Error('useForensics must be used within a ForensicsProvider');
  }
  return context;
}
