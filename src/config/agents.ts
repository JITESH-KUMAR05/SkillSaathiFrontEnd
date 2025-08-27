import { AgentCard } from '@/types';
import { 
  UserIcon, 
  AcademicCapIcon, 
  MicrophoneIcon,
  CodeBracketIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

export const AGENT_CONFIGS: AgentCard[] = [
  {
    id: 'companion',
    name: 'Companion Agent',
    type: 'companion',
    description: 'Your personal friend for emotional support, casual conversations, and daily motivation.',
    icon: 'UserIcon',
    color: 'bg-blue-500',
    isActive: true,
  },
  {
    id: 'mentor',
    name: 'Mentor Agent',
    type: 'mentor',
    description: 'Professional trainer to guide your career development and skill building.',
    icon: 'AcademicCapIcon',
    color: 'bg-green-500',
    isActive: true,
  },
  {
    id: 'interview',
    name: 'Interview Agent',
    type: 'interview',
    description: 'Professional evaluator to conduct mock interviews and assess your performance.',
    icon: 'MicrophoneIcon',
    color: 'bg-purple-500',
    isActive: true,
  },
  {
    id: 'coding',
    name: 'Coding Agent',
    type: 'coding',
    description: 'Expert programming assistant for code review, debugging, and technical guidance.',
    icon: 'CodeBracketIcon',
    color: 'bg-indigo-500',
    isActive: true,
  },
  {
    id: 'creative',
    name: 'Creative Agent',
    type: 'creative',
    description: 'Innovative assistant for creative writing, brainstorming, and artistic projects.',
    icon: 'LightBulbIcon',
    color: 'bg-yellow-500',
    isActive: true,
  },
  {
    id: 'research',
    name: 'Research Agent',
    type: 'research',
    description: 'Research specialist for in-depth analysis, fact-checking, and information gathering.',
    icon: 'MagnifyingGlassIcon',
    color: 'bg-red-500',
    isActive: true,
  },
  {
    id: 'general',
    name: 'General Agent',
    type: 'general',
    description: 'All-purpose assistant for general questions and everyday tasks.',
    icon: 'ChatBubbleLeftRightIcon',
    color: 'bg-gray-500',
    isActive: true,
  },
];

export const getAgentIcon = (iconName: string) => {
  const icons = {
    UserIcon,
    AcademicCapIcon,
    MicrophoneIcon,
    CodeBracketIcon,
    LightBulbIcon,
    MagnifyingGlassIcon,
    ChatBubbleLeftRightIcon,
  };
  return icons[iconName as keyof typeof icons] || ChatBubbleLeftRightIcon;
};

export const getAgentConfig = (type: string): AgentCard => {
  return AGENT_CONFIGS.find(config => config.type === type) || AGENT_CONFIGS[AGENT_CONFIGS.length - 1];
};
