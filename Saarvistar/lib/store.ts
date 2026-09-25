import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ChatSession,
  OutputFormatType,
  FormatContent,
  TwitterThreadContent,
  ExecutiveSummaryContent,
  PublicAdvisoryContent,
  LinkedInPostContent,
  SourceDocument,
} from './types';

// Default mock content matching code.html and screenshots
export const defaultExecutiveSummary: ExecutiveSummaryContent = {
  type: 'exec-summary',
  title: 'Executive Summary',
  tone: 'High Authority, Decisive',
  highlights: [
    'Perimeter exposure shifted 42% toward edge integrations during Q3, outpacing centralized telemetry coverage across EMEA regions.',
    'Third-party supply dependencies present the single highest residual systemic risk, with four critical vendors operating under grandfathered compliance thresholds.',
    'Autonomous incident mitigation delivered a 68% reduction in mean-time-to-containment (MTTC), proving immediate positive ROI on algorithmic orchestration.',
  ],
  sections: [
    {
      heading: '01 Core Findings & Risk Synthesis',
      body: 'The aggregate organizational attack surface expanded significantly over the preceding ninety days, directly driven by accelerated edge deployment and containerized microservice migrations. While centralized telemetry remains robust across primary cloud regions, cross-cluster egress policies exhibited observable variance from stated governance baselines.\n\nNotably, threat modeling reveals adversary tactics increasingly pivoting from brute endpoint disruption to quiet administrative credential harvesting via legacy OAuth permission flows. The strategic priority must balance perimeter fortification with immediate revocation protocols for inactive multi-tenant integrations.',
    },
  ],
};

export const defaultPublicAdvisory: PublicAdvisoryContent = {
  type: 'advisory',
  title: 'Public Security Advisory',
  subtitle: 'Threat Advisory & Guidance',
  noticeCallout: 'Advisory Notice: Edge Ingress & Token Expiration Mandate',
  overview:
    'During scheduled Q3 infrastructure observability checks, automated telemetry identified abnormal external probing patterns directed at edge ingress gateways. Core data lakes, customer encrypted vaults, and multi-tenant isolation boundaries remained uncompromised with zero unauthorized exfiltration detected.',
  technicalScope: {
    technique:
      'Synthetic credential cycling and dormant OAuth API token harvesting targeting legacy ingress endpoints.',
    blastRadius:
      'Confined exclusively to edge load balancer logs; internal application tiers and datastores remained isolated via zero-trust microsegmentation.',
    containment:
      'Automated revocation of inactive session tokens (>48 hours) completed globally within 42 minutes of initial heuristic trigger.',
  },
};

export const defaultLinkedInPost: LinkedInPostContent = {
  type: 'linkedin',
  title: 'LinkedIn Leadership Post',
  authorName: 'NTRO',
  bodyParagraphs: [
    'The modern enterprise attack surface does not expand uniformly.',
    'It expands wherever architectural agility collides with legacy governance assumptions.',
    'In our latest Q3 cyber resilience synthesis, one metric stood out with startling clarity:',
  ],
  highlightQuote:
    '👉 42% of posture vulnerabilities originated from edge integrations and grandfathered third-party SaaS connectors—not central cloud perimeter gaps.',
  keyPoints: [
    '1️⃣ Static credentials are technical debt. If your OAuth tokens lack automated 12-hour rotation, you have built an unlocked back door.',
    '2️⃣ Autonomous containment beats human escalation. Algorithmic orchestration reduced our mean-time-to-containment (MTTC) by 68%. Seconds count.',
    '3️⃣ Third-party vendor hygiene is systemic. Your security perimeter is only as strong as your 4th-most-integrated legacy vendor.',
  ],
  concludingThought:
    "Resilience in 2025 isn't about thicker perimeter walls—it's about relentless zero-trust visibility at the outermost boundaries.",
  engagementQuestion: 'What baseline security assumption is your team auditing before year-end?',
  hashtags: ['#ExecutiveLeadership', '#CyberSecurity', '#TechStrategy', '#EnterpriseRisk', '#CISO'],
};

export const defaultTwitterThread: TwitterThreadContent = {
  type: 'twitter',
  title: 'Twitter/X Narrative Thread',
  tweets: [
    {
      id: 'tweet-1',
      index: 1,
      total: 5,
      label: 'The Hook',
      text: '42% of enterprise vulnerabilities in Q3 didn\'t come from phishing or ransomware.\n\nThey came from neglected edge integrations and stale API tokens.\n\nHere is the tactical breakdown modern CISO teams need before Q4 ends: 🧵👇',
      metrics: { replies: 24, reposts: 86, likes: 312 },
    },
    {
      id: 'tweet-2',
      index: 2,
      total: 5,
      label: 'Finding',
      text: 'Legacy OAuth flows are the quietest threat vector in 2024.\n\nAdversaries aren\'t brute-forcing hardened perimeter firewalls anymore. They\'re simply walking through third-party SaaS connectors issued 18 months ago with permanent permissions.',
    },
    {
      id: 'tweet-3',
      index: 3,
      total: 5,
      label: 'Impact',
      text: 'When lateral movement happens at the edge, human triage is too slow.\n\nIn Q3 benchmark data: Autonomous algorithmic orchestration slashed Mean Time to Containment (MTTC) by 68%.\n\nManual triage is now a competitive liability.',
    },
    {
      id: 'tweet-4',
      index: 4,
      total: 5,
      label: 'Action',
      text: 'Immediate defensive checklist for this week:\n\n• Cap all external API SaaS tokens to 12-hr rotation.\n• Restrict cluster egress strictly to whitelisted destinations.\n• Revoke inactive multi-tenant integrations immediately.',
    },
    {
      id: 'tweet-5',
      index: 5,
      total: 5,
      label: 'Conclusion',
      text: 'Your resilience baseline is defined by your outermost edge, not your innermost vault.\n\nFull Strategic Cyber Resilience Advisory is published. Read & share to safeguard your architecture.\n\n🔁 Repost if this helps your roadmap.',
    },
  ],
};

const initialSessions: ChatSession[] = [
  {
    id: 'quarterly-narrative-synthesis',
    title: 'Quarterly Narrative Synthesis',
    createdAt: '2026-09-20T08:00:00Z',
    sourceDocument: {
      name: 'Q3_Strategic_Cyber_Resilience.pdf',
      size: '2.4 MB',
      uploadedAt: 'Sep 20, 2026',
    },
    selectedFormats: ['exec-summary', 'advisory', 'linkedin', 'twitter'],
    activeFormatId: 'twitter',
    formats: {
      'exec-summary': {
        id: 'exec-summary',
        name: 'Executive Summary',
        content: defaultExecutiveSummary,
      },
      'advisory': {
        id: 'advisory',
        name: 'Public Advisory',
        content: defaultPublicAdvisory,
      },
      'linkedin': {
        id: 'linkedin',
        name: 'LinkedIn Post',
        content: defaultLinkedInPost,
      },
      'twitter': {
        id: 'twitter',
        name: 'Twitter/X Thread',
        content: defaultTwitterThread,
      },
    },
    promptHistory: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Transform Q3_Strategic_Cyber_Resilience.pdf into all key multi-channel leadership formats.',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'executive-summary-generator',
    title: 'Executive Summary Generator',
    createdAt: '2026-09-18T14:30:00Z',
    sourceDocument: {
      name: 'FY26_Budget_Framework.pdf',
      size: '1.8 MB',
      uploadedAt: 'Sep 18, 2026',
    },
    selectedFormats: ['exec-summary', 'linkedin'],
    activeFormatId: 'exec-summary',
    formats: {
      'exec-summary': {
        id: 'exec-summary',
        name: 'Executive Summary',
        content: defaultExecutiveSummary,
      },
      'linkedin': {
        id: 'linkedin',
        name: 'LinkedIn Post',
        content: defaultLinkedInPost,
      },
    },
    promptHistory: [],
  },
  {
    id: 'tone-shift-brand-guidelines',
    title: 'Tone Shift: Brand Guidelines',
    createdAt: '2026-09-17T11:15:00Z',
    selectedFormats: ['exec-summary'],
    activeFormatId: 'exec-summary',
    formats: {
      'exec-summary': {
        id: 'exec-summary',
        name: 'Executive Summary',
        content: defaultExecutiveSummary,
      },
    },
    promptHistory: [],
  },
  {
    id: 'technical-whitepaper-rewrite',
    title: 'Technical Whitepaper Rewrite',
    createdAt: '2026-09-15T09:20:00Z',
    selectedFormats: ['exec-summary', 'twitter'],
    activeFormatId: 'twitter',
    formats: {
      'exec-summary': {
        id: 'exec-summary',
        name: 'Executive Summary',
        content: defaultExecutiveSummary,
      },
      'twitter': {
        id: 'twitter',
        name: 'Twitter/X Thread',
        content: defaultTwitterThread,
      },
    },
    promptHistory: [],
  },
  {
    id: 'multi-format-press-brief',
    title: 'Multi-Format Press Brief',
    createdAt: '2026-09-12T16:45:00Z',
    selectedFormats: ['advisory', 'linkedin'],
    activeFormatId: 'advisory',
    formats: {
      'advisory': {
        id: 'advisory',
        name: 'Public Advisory',
        content: defaultPublicAdvisory,
      },
      'linkedin': {
        id: 'linkedin',
        name: 'LinkedIn Post',
        content: defaultLinkedInPost,
      },
    },
    promptHistory: [],
  },
];

interface ToastState {
  show: boolean;
  message: string;
}

interface AppStore {
  // Navigation & Sessions
  sessions: ChatSession[];
  activeChatId: string | null;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveChat: (id: string | null) => void;
  createSession: (title?: string, sourceDoc?: Partial<SourceDocument>) => string;
  deleteSession: (id: string) => void;

  // Active Chat State
  setActiveFormat: (formatId: OutputFormatType) => void;
  updateFormatContent: (chatId: string, formatId: OutputFormatType, content: FormatContent) => void;
  addFormatToChat: (chatId: string, formatId: string, name: string) => void;

  // Global Generation State
  isGenerating: boolean;
  generatingFormatId: string | null;
  setIsGenerating: (isGen: boolean, formatId?: string | null) => void;

  // Preferences
  themeMode: 'dark' | 'light' | 'system';
  setThemeMode: (mode: 'dark' | 'light' | 'system') => void;
  compactDensity: boolean;
  setCompactDensity: (compact: boolean) => void;

  // Feedback & Toast
  toast: ToastState;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      sessions: initialSessions,
      activeChatId: null,
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setActiveChat: (id) => set({ activeChatId: id }),

      createSession: (title = 'New Narrative Transformation', sourceDoc?: Partial<SourceDocument>) => {
        const id = 'chat-' + Date.now();
        const newSession: ChatSession = {
          id,
          title,
          sourceDocument: {
            name: sourceDoc?.name || 'Uploaded_Source_Document.pdf',
            size: sourceDoc?.size || '1.2 MB',
            uploadedAt: sourceDoc?.uploadedAt || 'Just now',
          },
          createdAt: new Date().toISOString(),
          selectedFormats: ['exec-summary', 'twitter'],
          activeFormatId: 'twitter',
          formats: {
            'exec-summary': {
              id: 'exec-summary',
              name: 'Executive Summary',
              content: defaultExecutiveSummary,
            },
            'twitter': {
              id: 'twitter',
              name: 'Twitter/X Thread',
              content: defaultTwitterThread,
            },
          },
          promptHistory: [],
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeChatId: id,
        }));

        return id;
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeChatId: state.activeChatId === id ? null : state.activeChatId,
        }));
      },

      setActiveFormat: (formatId) => {
        const { activeChatId, sessions } = get();
        if (!activeChatId) return;
        set({
          sessions: sessions.map((s) =>
            s.id === activeChatId ? { ...s, activeFormatId: formatId } : s
          ),
        });
      },

      updateFormatContent: (chatId, formatId, content) => {
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== chatId) return s;
            return {
              ...s,
              formats: {
                ...s.formats,
                [formatId]: {
                  ...s.formats[formatId],
                  content,
                },
              },
            };
          }),
        }));
      },

      addFormatToChat: (chatId, formatId, name) => {
        const { sessions } = get();
        const session = sessions.find((s) => s.id === chatId);
        if (!session) return;

        let sampleContent: FormatContent;
        if (formatId === 'exec-summary') sampleContent = defaultExecutiveSummary;
        else if (formatId === 'advisory') sampleContent = defaultPublicAdvisory;
        else if (formatId === 'linkedin') sampleContent = defaultLinkedInPost;
        else if (formatId === 'twitter') sampleContent = defaultTwitterThread;
        else {
          sampleContent = {
            type: 'custom',
            title: name,
            rawText: `Synthesized intelligence for ${name} based on source documents.`,
          };
        }

        set({
          sessions: sessions.map((s) => {
            if (s.id !== chatId) return s;
            return {
              ...s,
              selectedFormats: s.selectedFormats.includes(formatId)
                ? s.selectedFormats
                : [...s.selectedFormats, formatId],
              activeFormatId: formatId,
              formats: {
                ...s.formats,
                [formatId]: {
                  id: formatId,
                  name,
                  content: sampleContent,
                },
              },
            };
          }),
        });
      },

      isGenerating: false,
      generatingFormatId: null,
      setIsGenerating: (isGenerating, generatingFormatId = null) =>
        set({ isGenerating, generatingFormatId }),

      themeMode: 'dark',
      setThemeMode: (mode) => set({ themeMode: mode }),
      compactDensity: true,
      setCompactDensity: (compact) => set({ compactDensity: compact }),

      toast: { show: false, message: '' },
      showToast: (message) => {
        set({ toast: { show: true, message } });
        setTimeout(() => {
          set({ toast: { show: false, message: '' } });
        }, 2500);
      },
      hideToast: () => set({ toast: { show: false, message: '' } }),
    }),
    {
      name: 'sarvistar-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        activeChatId: state.activeChatId,
        themeMode: state.themeMode,
        compactDensity: state.compactDensity,
      }),
    }
  )
);
