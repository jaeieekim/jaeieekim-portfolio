export type FilterType = "All" | "Team project" | "Personal project" | "Work" | "AI experiment";

export type Block =
  | { type: "image"; src: string }
  | { type: "video"; src: string }
  | { type: "image-video"; imageSrc: string; videoSrc: string };

export interface Project {
  slug: string;
  idx: string;
  name: string;
  type: FilterType;
  period: string;
  summary: string;
  image?: string;
  blocks?: Block[];
  projectLink?: string;
  serviceLink?: string;
  hideDetail?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "01",
    idx: "01",
    name: "런드리더",
    type: "Team project",
    period: "25.08  ·  개발 및 배포 완료",
    summary:
      "의류 케어 라벨을 분석해서 세탁과 의류 관리 방법을 쉽게 안내해주는 AI 세탁 도우미 서비스입니다. ai 포텐데이 해커톤 프로젝트로 1위를 수상했습니다.",
    image: "/images/projects/laundry-leader.png",
    blocks: [
      { type: "image", src: "/images/projects/laundry-01.png" },
      { type: "image", src: "/images/projects/laundry-02.png" },
      { type: "image", src: "/images/projects/laundry-03.png" },
      { type: "image", src: "/images/projects/laundry-04.png" },
      { type: "image", src: "/images/projects/laundry-05.png" },
      { type: "image", src: "/images/projects/laundry-06.png" },
      { type: "image", src: "/images/projects/laundry-07.png" },
      { type: "image", src: "/images/projects/laundry-08.png" },
      { type: "image", src: "/images/projects/laundry-09.png" },
      { type: "image", src: "/images/projects/laundry-10.png" },
      { type: "image", src: "/images/projects/laundry-11.png" },
      { type: "image", src: "/images/projects/laundry-12.png" },
      { type: "image", src: "/images/projects/laundry-13.png" },
      { type: "image", src: "/images/projects/laundry-14.png" },
      { type: "image", src: "/images/projects/laundry-15.png" },
      { type: "image", src: "/images/projects/laundry-16b.png" },
    ],
    projectLink: "#",
    serviceLink: "https://laundreader.com",
  },
  {
    slug: "02",
    idx: "02",
    name: "찰칵특공대",
    type: "Personal project",
    period: "25.10 — 25.12",
    summary:
      "유저 스타일과 무드에 맞는 정확한 사진관 탐색 비교를 통해 성공적인 사진을 찍게 돕는 사진관 탐색, 예약 서비스입니다.",
    image: "/images/projects/chalcak.png",
    blocks: [
      { type: "image", src: "/images/projects/chalcak-01.png" },
      { type: "image", src: "/images/projects/chalcak-02.png" },
      { type: "image", src: "/images/projects/chalcak-03.png" },
      { type: "image", src: "/images/projects/chalcak-04.png" },
      { type: "image", src: "/images/projects/chalcak-05.png" },
      { type: "image", src: "/images/projects/chalcak-06.png" },
      { type: "image", src: "/images/projects/chalcak-07.png" },
      { type: "image", src: "/images/projects/chalcak-08.png" },
      { type: "image", src: "/images/projects/chalcak-09.png" },
      { type: "image", src: "/images/projects/chalcak-10.png" },
      { type: "image", src: "/images/projects/chalcak-11.png" },
      { type: "image", src: "/images/projects/chalcak-12.png" },
      { type: "image", src: "/images/projects/chalcak-13.png" },
      { type: "image-video", imageSrc: "/images/projects/chalcak-15b.png", videoSrc: "/images/projects/chalcak-proto3.mp4" },
    ],
    projectLink: "#",
  },
  {
    slug: "03",
    idx: "03",
    name: "네이버 시리즈",
    type: "Personal project",
    period: "24.12 — 25.02",
    summary:
      "앱에서 원하는 작품을 찾고 구매할 수 있도록 복잡한 여정을 재설계한, 취향 공유 커뮤니티 환경 기반 작품 탐색 경험 개선 작업입니다.",
    image: "/images/projects/naver-series.png",
    blocks: [
      { type: "image", src: "/images/projects/naver-01.png" },
      { type: "image", src: "/images/projects/naver-02.png" },
      { type: "image", src: "/images/projects/naver-03.png" },
      { type: "image", src: "/images/projects/naver-04.png" },
      { type: "image", src: "/images/projects/naver-05.png" },
      { type: "image", src: "/images/projects/naver-06c.png" },
      { type: "image", src: "/images/projects/naver-07.png" },
      { type: "image", src: "/images/projects/naver-08.png" },
    ],
    projectLink: "#",
  },
  {
    slug: "04",
    idx: "04",
    name: "KB 차차차 커뮤니티",
    type: "Work",
    period: "22.09 — 23.02  ·  개발 및 배포 완료",
    summary:
      "지속적인 앱 방문을 유도하고, 차량 구매를 고민하는 사용자를 돕기 위해 중고차 커뮤니티 서비스를 기획했습니다.",
    image: "/images/projects/kb-chachacha.png",
    blocks: [
      { type: "image", src: "/images/projects/kb-01.png" },
      { type: "image", src: "/images/projects/kb-02.png" },
      { type: "image", src: "/images/projects/kb-03.png" },
    ],
    projectLink: "#",
    serviceLink: "https://m.kbchachacha.com/public/web/community/main.kbc?_source=home_top_banner",
  },
  {
    slug: "05",
    idx: "05",
    name: "포트폴리오 웹사이트 빌드",
    type: "AI experiment",
    period: "26.06.18 — 26.06.23",
    summary:
      "클로드와 커서 AI를 활용해 반응형 포트폴리오 웹사이트를 제작했습니다.",
    image: "/images/projects/portfolio-web.png",
    blocks: [
      { type: "image", src: "/images/projects/portfolio-web-01.png" },
    ],
  },
  {
    slug: "06",
    idx: "06",
    name: "UX 라이팅 생성기",
    type: "AI experiment",
    period: "26.06.25",
    summary:
      "UX 문구가 고민될 때, AI가 자동으로 라이팅 문구를 생성해주고 활용 시안을 함께 보여주는 서비스입니다. 클로드에서 이용할 수 있습니다.",
    image: "/images/projects/ux-writing.png",
    serviceLink: "https://claude.ai/public/artifacts/3c0b7c6a-5424-496e-8cdf-eac4cd65ceeb",
    hideDetail: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
