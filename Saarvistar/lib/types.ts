export type OutputFormatType = 
  | 'exec-summary' 
  | 'advisory' 
  | 'linkedin' 
  | 'twitter' 
  | string;

export interface TweetCardData {
  id: string;
  index: number;
  total: number;
  label: string;
  text: string;
  metrics?: {
    replies: number;
    reposts: number;
    likes: number;
  };
}

export interface ExecutiveSummaryContent {
  type: 'exec-summary';
  title: string;
  tone: string;
  highlights: string[];
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface PublicAdvisoryContent {
  type: 'advisory';
  title: string;
  subtitle: string;
  noticeCallout: string;
  overview: string;
  technicalScope: {
    technique: string;
    blastRadius: string;
    containment: string;
  };
}

export interface LinkedInPostContent {
  type: 'linkedin';
  title: string;
  authorName: string;
  bodyParagraphs: string[];
  highlightQuote: string;
  keyPoints: string[];
  concludingThought: string;
  engagementQuestion: string;
  hashtags: string[];
}

export interface TwitterThreadContent {
  type: 'twitter';
  title: string;
  tweets: TweetCardData[];
}

export interface CustomFormatContent {
  type: 'custom';
  title: string;
  rawText: string;
}

export type FormatContent =
  | ExecutiveSummaryContent
  | PublicAdvisoryContent
  | LinkedInPostContent
  | TwitterThreadContent
  | CustomFormatContent;

export interface SourceDocument {
  name: string;
  size?: string;
  type?: string;
  uploadedAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  sourceDocument?: SourceDocument;
  createdAt: string;
  selectedFormats: OutputFormatType[];
  activeFormatId: OutputFormatType;
  formats: Record<
    OutputFormatType,
    {
      id: OutputFormatType;
      name: string;
      content: FormatContent;
      isGenerating?: boolean;
    }
  >;
  promptHistory: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
}

export interface UserProfile {
  name: string;
  plan: string;
  avatarText?: string;
  activeStatus: string;
}
