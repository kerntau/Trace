export interface ArticleFrontmatter {
  id: string | number;
  title: string;
  description?: string;
  cover?: string;
  category?: string;
  tags?: string[];
  createTime: string | number;
  updateTime?: string | number;
  isDraft?: boolean;
  isTop?: boolean;
  encrypt?: {
    enable: boolean;
    password?: string;
  };
  seo?: {
    keywords?: string[];
    description?: string;
  };
  views?: number;
  likes?: number;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  content: string;
  toc?: TocItem[];
  readingTime?: {
    minutes: number;
    words: number;
  };
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  sort?: number;
  hidden?: boolean;
  count?: number;
}

export interface Tag {
  id: string | number;
  name: string;
  slug: string;
  color?: string;
  count?: number;
}

export interface RecordItem {
  id: string | number;
  content: string;
  images?: string[];
  createTime: string | number;
  location?: string;
  mood?: string;
  likes?: number;
}

export interface FootprintItem {
  id: string | number;
  title: string;
  location: string;
  coordinates?: [number, number]; // [lng, lat]
  description?: string;
  date: string;
  cover?: string;
}

export interface MilestoneItem {
  id: string | number;
  title: string;
  date: string;
  description?: string;
  cover?: string;
  icon?: string;
  color?: string;
}

export interface FriendLinkItem {
  id: string | number;
  name: string;
  link: string;
  avatar: string;
  desc: string;
  group?: string;
  tag?: string;
}

export interface WallMessage {
  id: string | number;
  nickname: string;
  content: string;
  avatar?: string;
  color?: string;
  createTime: string | number;
  contact?: string;
}

export interface NavMenuItem {
  title: string;
  path: string;
  icon?: string;
  external?: boolean;
  children?: NavMenuItem[];
}

export interface SiteAuthor {
  name: string;
  avatar: string;
  description: string;
  bio?: string;
  email?: string;
  location?: string;
  github?: string;
  socials?: {
    name: string;
    icon: string;
    url: string;
  }[];
}

export interface SiteConfig {
  title: string;
  subtitle?: string;
  description: string;
  url: string;
  logo: string;
  favicon: string;
  author: SiteAuthor;
  navMenu: NavMenuItem[];
  footer: {
    copyright: string;
    icp?: string;
    policeIcp?: string;
    customText?: string;
    sinceYear?: number;
  };
  seo: {
    keywords: string[];
    ogImage?: string;
    twitterHandle?: string;
  };
}

export interface ThemeConfig {
  primaryColor: string;
  darkMode: "system" | "light" | "dark";
  enableAnimation: boolean;
  fontFamily?: string;
  banner: {
    enable: boolean;
    title?: string;
    subtitles?: string[];
    bgImage?: string;
    typedSpeed?: number;
    showArrow?: boolean;
  };
  heroCard: {
    enable: boolean;
    recommendArticles?: (string | number)[];
    techStack?: { name: string; icon: string }[];
  };
  customCss?: string;
}

export interface GlobalContentData {
  site: SiteConfig;
  theme: ThemeConfig;
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  records: RecordItem[];
  footprints: FootprintItem[];
  milestones: MilestoneItem[];
  friendLinks: FriendLinkItem[];
  wallMessages: WallMessage[];
}
