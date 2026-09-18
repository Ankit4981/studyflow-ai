"use client";

import { useState, useMemo } from "react";
import {
  Newspaper,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Shuffle,
  Brain,
  Cpu,
  Atom,
  GraduationCap,
  X,
  Share2,
  Check,
  Flame,
} from "lucide-react";
import { playSound } from "@/lib/audioEffects";

export interface DailyArticle {
  id: string;
  title: string;
  category: "brain" | "tech" | "science" | "academic";
  categoryLabel: string;
  readTime: string;
  published: string;
  author: string;
  snippet: string;
  keyTakeaways: string[];
  fullContent: string;
  studyPrompt: string;
  glossary: { term: string; definition: string }[];
}

const CURIOSITY_SPARKS = [
  {
    fact: "Testing yourself on material before you study it can increase subsequent recall by up to 40%, even if you guess wrong initially (The 'Pretesting Effect').",
    source: "Journal of Experimental Psychology",
  },
  {
    fact: "Sleep spindles during Stage 2 NREM sleep actively transfer fragile short-term memories from the hippocampus to the neocortex for permanent storage.",
    source: "Nature Neuroscience",
  },
  {
    fact: "Explaining a concept to a rubber duck or a peer in simple terms (The Feynman Technique) reveals hidden cognitive blind spots in minutes.",
    source: "Cognitive Science Review",
  },
  {
    fact: "Handwritten notes produce stronger neural connectivity across the parietal and central brain regions compared to typing on a laptop.",
    source: "Frontiers in Psychology",
  },
];

const DAILY_ARTICLES: DailyArticle[] = [
  {
    id: "art-1",
    title: "The 20-Minute Spaced Retrieval Rule: How Neuroplasticity Consolidates Long-Term Memory",
    category: "brain",
    categoryLabel: "Brain & Learning Science",
    readTime: "3 min read",
    published: "Today • 8:30 AM",
    author: "Dr. Clara Hensley, Cognitive Neuroscientist",
    snippet:
      "Recent fMRI findings from Cambridge reveal that retrieving information 20 minutes after learning triggers rapid synaptic tagging, preventing the classic Ebbinghaus forgetting curve drop-off.",
    keyTakeaways: [
      "Synaptic consolidation begins within 20 minutes of initial encoding.",
      "Self-testing produces 3x higher retention after 1 week compared to passive re-reading.",
      "Spacing retrieval across expanding intervals (20m, 1d, 3d, 7d) maximizes long-term synaptic potentiation.",
    ],
    fullContent: `Neuroscientists have long studied why cramming fails while spaced retrieval succeeds. A breakthrough 2026 neuroimaging study conducted across 450 university students demonstrated that memory consolidation is not a passive biochemical fade; it is an active structural reorganization.

When you first read a piece of information, your hippocampus creates a temporary synaptic pattern. If this pattern is not recalled within a critical 20-minute window, protein synthesis declines and the memory trace deteriorates by up to 50%.

However, when a student engages in active retrieval—such as answering a flashcard or summarizing from memory without looking at notes—the brain releases dopamine and brain-derived neurotrophic factor (BDNF). This triggers 'synaptic tagging', cementing the connection between hippocampal networks and cortical storage hubs.

### Practical Student Protocol:
1. **The 20-Minute Checkpoint**: After a study chunk, close all tabs and write 3 core takeaways from pure memory.
2. **Expanding Intervals**: Review flashcards at +24 hours, +3 days, and +7 days.
3. **Desirable Difficulty**: If retrieval feels difficult, your brain is doing the deep architectural work that builds permanent comprehension.`,
    studyPrompt:
      "How can you integrate the 20-minute spaced retrieval rule into your daily study routine to cut exam revision time in half?",
    glossary: [
      {
        term: "Synaptic Tagging",
        definition:
          "The cellular process by which stimulated synapses are marked for subsequent long-term protein capture.",
      },
      {
        term: "BDNF",
        definition:
          "Brain-Derived Neurotrophic Factor, a protein that promotes the survival and growth of neurons.",
      },
    ],
  },
  {
    id: "art-2",
    title: "Next-Gen AI Systems in Education: Transitioning from Answering Tools to Socratic Tutors",
    category: "tech",
    categoryLabel: "Tech & AI Innovations",
    readTime: "4 min read",
    published: "Today • 7:15 AM",
    author: "Elena Rostova, EdTech Research Lead",
    snippet:
      "The latest generation of educational language models is designed to refuse direct answers, instead asking guiding questions that scaffold deeper deductive reasoning.",
    keyTakeaways: [
      "Direct AI answer generators cause cognitive dependency and shallow recall.",
      "Socratic AI scaffolding forces students to articulate hypotheses, strengthening critical thinking.",
      "Adaptive difficulty matching ensures students remain in the optimal Zone of Proximal Development.",
    ],
    fullContent: `Artificial intelligence in academic environments has entered its second paradigm. While early generative models acted as instant search engines and ghostwriters, educational institutions are deploying pedagogical Socratic agents.

Studies show that students who receive instant answers from AI exhibit a 28% drop in independent problem-solving exam scores compared to those mentored with inquiry-based guidance. 

Modern educational AI frameworks—like StudyFlow's Sensei Mascot and Dojo engine—deliberately provide conceptual hints, decomposition into micro-tasks, and comparative analogies rather than copy-paste solutions.

### Key Dimensions of Socratic AI:
- **Decomposition**: Breaking multi-step physics or essay prompts into bite-sized actionable missions.
- **Error Identification**: Prompting the student to spot their own calculation or logical flaw before offering the correction.
- **Metacognitive Reflection**: Asking the learner 'Why did this approach work?' after finding the right solution.`,
    studyPrompt:
      "Why does formulating a question to an AI tutor yield higher understanding than asking it to write a full answer for you?",
    glossary: [
      {
        term: "Zone of Proximal Development (ZPD)",
        definition:
          "The space between what a learner can do without assistance and what they can achieve with guidance.",
      },
      {
        term: "Metacognition",
        definition:
          "Awareness and understanding of one's own thought processes and learning strategies.",
      },
    ],
  },
  {
    id: "art-3",
    title: "James Webb Telescope Detects Organic Biosignatures on Temperate Exoplanet Atmosphere",
    category: "science",
    categoryLabel: "Science & Discovery",
    readTime: "3 min read",
    published: "Yesterday • 6:40 PM",
    author: "Astrophysics Newsroom",
    snippet:
      "Spectroscopic data from NASA's JWST reveals carbon-bearing molecules, including methane and carbon dioxide, in the habitable zone of star system LHS 1140.",
    keyTakeaways: [
      "Transmission spectroscopy confirmed atmospheric water vapor and carbon dioxide.",
      "The planet orbits within the habitable zone, with equilibrium temperatures permitting liquid surface oceans.",
      "Demonstrates the power of optical spectroscopy in identifying chemical fingerprints across interstellar distances.",
    ],
    fullContent: `Astronomers analyzing infrared transmission spectra from the James Webb Space Telescope (JWST) have confirmed unambiguous detections of methane and carbon dioxide in the upper atmosphere of LHS 1140 b, a rocky super-Earth located 48 light-years away in the constellation Cetus.

By observing starlight filtering through the exoplanet's atmospheric limb during transit events, the Near-Infrared Spectrograph (NIRSpec) detected molecular absorption bands with a confidence level exceeding 5 sigma.

LHS 1140 b has an estimated radius of 1.73 Earth radii and orbits its M-dwarf host star within the circumstellar habitable zone. Unlike closer exoplanets stripped by stellar flares, LHS 1140 b appears to retain a substantial secondary nitrogen-rich atmosphere.

### Scientific Significance:
- First definitive atmospheric characterization of a habitable-zone rocky world using JWST.
- Validates Beer-Lambert absorption physics on interstellar scales.
- Paves the way for direct detection of trace biosignatures like dimethyl sulfide (DMS).`,
    studyPrompt:
      "Explain the physical mechanism of transmission spectroscopy and how absorption lines allow scientists to determine chemical compositions from light years away.",
    glossary: [
      {
        term: "Transmission Spectroscopy",
        definition:
          "A method of analyzing the chemical composition of an atmosphere by measuring how starlight is absorbed as it passes through the gas during a transit.",
      },
      {
        term: "Habitable Zone",
        definition:
          "The orbital region around a star where temperatures allow liquid water to exist on a planet's surface.",
      },
    ],
  },
  {
    id: "art-4",
    title: "The Dual-Coding Method: How Combining Visual Diagrams with Verbal Explanations Doubles Retention",
    category: "academic",
    categoryLabel: "Academic Mastery",
    readTime: "3 min read",
    published: "Today • 9:00 AM",
    author: "Prof. Marcus Vance, Learning Architecture",
    snippet:
      "Allan Paivio's Dual-Coding Theory proves that processing information through both visual and verbal working memory channels eliminates cognitive bottlenecks.",
    keyTakeaways: [
      "The human brain processes visual and linguistic data in separate, non-competing cognitive channels.",
      "Creating mind maps, flowcharts, or spatial cards alongside textual notes doubles neural retrieval cues.",
      "Avoids split-attention overload by harmonizing diagram labels with concise explanations.",
    ],
    fullContent: `When studying complex systems—such as metabolic pathways in biology, architectural layers in computer science, or constitutional law frameworks—relying purely on blocks of prose strains the phonological loop of working memory.

According to Dual-Coding Theory (Paivio, 1971; confirmed in 2025 fMRI paradigms), visual and verbal information are processed along distinct mental channels. When you pair an illustrated structure (such as a 3D flashcard or flow diagram) with a clear verbal concept, your brain builds two interconnected memory representations.

During an exam, if you forget the verbal term, the visual memory trace can cue the answer, and vice versa.

### How to Apply Dual-Coding in Your StudyFlow:
1. **Transform Notes into Schematics**: Convert linear bullet points into cause-and-effect flow diagrams.
2. **Concept Association**: Tag key terminology with relevant visual icons and spatial relationships.
3. **Verbal Drawing**: While sketching a diagram, speak the underlying mechanism aloud in simple terms.`,
    studyPrompt:
      "Choose one difficult topic from your current syllabus and design a dual-coded diagram combining spatial layout with concise verbal anchors.",
    glossary: [
      {
        term: "Dual-Coding Theory",
        definition:
          "A cognitive theory stating that the human mind processes visual and verbal information through separate, complementary channels.",
      },
      {
        term: "Phonological Loop",
        definition:
          "The component of working memory responsible for handling spoken and written language.",
      },
    ],
  },
  {
    id: "art-5",
    title: "CRISPR-Cas9 Epigenetic Editing: Silencing Genetic Disease Without Cutting DNA",
    category: "science",
    categoryLabel: "Science & Discovery",
    readTime: "4 min read",
    published: "Yesterday • 3:20 PM",
    author: "Biotech Dispatch",
    snippet:
      "Researchers at the Broad Institute have perfected 'dead Cas9' epigenome modifiers that turn pathogenic genes off permanently without introducing double-strand DNA breaks.",
    keyTakeaways: [
      "dCas9 acts as a precision vehicle without cutting the phosphodiester backbone of DNA.",
      "Methylation enzymes attached to Cas9 silence target genes cleanly without off-target double-strand breaks.",
      "Major therapeutic implications for sickle cell disease, Huntington's, and hypercholesterolemia.",
    ],
    fullContent: `Traditional CRISPR gene editing relies on the Cas9 endonuclease to slice both strands of DNA at a target site, after which the cell repairs the break through non-homologous end joining (NHEJ). While effective, double-strand breaks risk dangerous chromosomal translocations and unintended off-target insertions.

The new methodology utilizes 'catalytically inactive' dCas9 fused to DNA methyltransferases. Guided by synthetic single guide RNA (sgRNA), the complex navigates to the promoter region of the target gene. 

Instead of cutting, it adds methyl groups (-CH3) to cytosine bases, tightly packing the chromatin and rendering the gene inaccessible to RNA polymerase.

### Why This Matters for Biology Students:
- Illustrates how gene expression can be modulated epigenetically without altering the underlying nucleotide sequence.
- Demonstrates modern molecular biotechnology combining guide RNA targeting with enzymatic methylation.`,
    studyPrompt:
      "Compare and contrast traditional CRISPR-Cas9 endonuclease editing with epigenetic dCas9 gene silencing in terms of mechanism and safety.",
    glossary: [
      {
        term: "dCas9 (Dead Cas9)",
        definition:
          "A mutated variant of Cas9 that has lost its catalytic cutting ability but retains high-affinity DNA binding.",
      },
      {
        term: "DNA Methylation",
        definition:
          "An epigenetic mechanism where methyl groups are added to the DNA molecule, typically repressing gene transcription.",
      },
    ],
  },
  {
    id: "art-6",
    title: "Sleep Architecture and Memory Consolidation: The Exact Math of Overnight Retention",
    category: "brain",
    categoryLabel: "Brain & Learning Science",
    readTime: "3 min read",
    published: "2 days ago",
    author: "Sleep & Cognition Lab",
    snippet:
      "All-night study sessions reduce subsequent test performance by 35%. Deep Slow-Wave Sleep (SWS) synchronized with REM sleep is mathematically essential for memory integration.",
    keyTakeaways: [
      "Slow-Wave Sleep (SWS) replays hippocampal memories at 20x real-time speed for cortical storage.",
      "REM sleep integrates new concepts into existing semantic knowledge structures.",
      "Pulling an all-nighter impairs cognitive retrieval speed and induces micro-lapses in working memory.",
    ],
    fullContent: `A comprehensive meta-analysis of over 1,200 university students found that students who maintained a consistent 7.5-hour sleep schedule outperformed peers who pulled all-nighters by an average of 1.4 GPA letter grades.

During slow-wave sleep (Stage 3 NREM), the brain generates high-voltage delta waves coupled with hippocampal sharp-wave ripples. During this phase, neural circuits replay the exact patterns activated during the day's study sessions at accelerated speeds.

Then, during rapid eye movement (REM) sleep, the brain cross-references these fresh memories against existing schemas, creating the novel analogies and intuitive 'aha!' moments needed for high-order exam questions.

### Sleep Hygiene for High-Yield Revision:
1. **Study Before Sleep**: Review your highest-priority flashcards 45 minutes before sleep.
2. **Avoid Late Blue Light**: Dim screen brightness 1 hour before bed to allow melatonin release.
3. **No All-Nighters**: 6 hours of sleep + 2 hours of focused morning study will always outperform 8 hours of fatigued overnight cramming.`,
    studyPrompt:
      "Why is memory consolidation during Slow-Wave Sleep structurally superior to passive awake rest?",
    glossary: [
      {
        term: "Sharp-Wave Ripples",
        definition:
          "High-frequency oscillatory neural patterns in the hippocampus that replay daytime memory traces during sleep.",
      },
      {
        term: "Slow-Wave Sleep (SWS)",
        definition:
          "The deepest phase of non-REM sleep characterized by synchronized delta oscillations.",
      },
    ],
  },
];

interface DailyNewsHubProps {
  onLoadArticleToStudy?: (articleText: string, title: string) => void;
}

export function DailyNewsHub({ onLoadArticleToStudy }: DailyNewsHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("studyflow_news_bookmarks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });
  const [activeArticleModal, setActiveArticleModal] = useState<DailyArticle | null>(null);
  const [curiosityIndex, setCuriosityIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  function toggleBookmark(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    playSound("click");
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("studyflow_news_bookmarks", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function handleShuffleCuriosity() {
    playSound("click");
    setCuriosityIndex((prev) => (prev + 1) % CURIOSITY_SPARKS.length);
  }

  function handleReadArticle(art: DailyArticle) {
    playSound("click");
    setActiveArticleModal(art);
  }

  function handleTransformArticle(art: DailyArticle, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    playSound("success");
    const studyContent = `# ${art.title}\n\n${art.snippet}\n\n## Key Takeaways:\n${art.keyTakeaways
      .map((k) => `- ${k}`)
      .join("\n")}\n\n## In-Depth Analysis:\n${art.fullContent}`;

    if (onLoadArticleToStudy) {
      onLoadArticleToStudy(studyContent, art.title);
    }
    if (activeArticleModal) {
      setActiveArticleModal(null);
    }
  }

  function handleShare(art: DailyArticle) {
    playSound("click");
    const shareText = `📰 ${art.title}\n\nKey Takeaways:\n${art.keyTakeaways.join(
      "\n"
    )}\n\nRead on StudyFlow AI Gazette ✦`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return DAILY_ARTICLES.filter((art) => {
      const matchesCategory =
        selectedCategory === "all"
          ? true
          : selectedCategory === "bookmarked"
          ? bookmarkedIds.includes(art.id)
          : art.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, bookmarkedIds]);

  const currentSpark = CURIOSITY_SPARKS[curiosityIndex];

  return (
    <div className="w-full flex flex-col gap-6 mt-12 pt-8 border-t border-outline-variant">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-lg bg-primary-container text-on-primary-container">
              <Newspaper size={16} />
            </span>
            <span className="text-xs font-label font-bold text-primary uppercase tracking-widest">
              Daily Scholar Gazette &amp; Intel
            </span>
          </div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
            Daily Academic &amp; Scientific Briefings
          </h2>
          <p className="text-xs font-label text-on-surface-variant mt-1">
            Curated research, cognitive science breakthroughs &amp; 1-click study transformations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search daily intel..."
            className="w-full pl-9 pr-4 py-2 bg-surface rounded-xl border border-outline-variant text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all font-label"
          />
        </div>
      </div>

      {/* Curiosity Spark Ticker Banner */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-warning-container text-warning shrink-0 mt-0.5 sm:mt-0">
            <Sparkles size={15} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-label font-bold text-warning uppercase tracking-wider">
                Daily Brain Spark
              </span>
              <span className="text-[10px] text-on-surface-variant font-label">
                • {currentSpark.source}
              </span>
            </div>
            <p className="text-xs font-body italic text-on-surface mt-0.5">
              &ldquo;{currentSpark.fact}&rdquo;
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShuffleCuriosity}
          title="Shuffle brain spark"
          className="p-2 rounded-xl bg-surface hover:bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface transition-all shrink-0 cursor-pointer"
        >
          <Shuffle size={14} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Briefings", icon: Newspaper },
          { id: "brain", label: "Brain & Learning", icon: Brain },
          { id: "tech", label: "Tech & AI", icon: Cpu },
          { id: "science", label: "Science & Space", icon: Atom },
          { id: "academic", label: "Academic Success", icon: GraduationCap },
          { id: "bookmarked", label: `Saved (${bookmarkedIds.length})`, icon: Bookmark },
        ].map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playSound("click");
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <Icon size={13} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center flex flex-col items-center gap-3">
          <BookOpen size={32} className="text-outline" />
          <p className="font-headline text-lg font-bold text-on-surface">No briefings found</p>
          <p className="text-xs font-label text-on-surface-variant max-w-md">
            {selectedCategory === "bookmarked"
              ? "You haven't bookmarked any articles yet. Tap the bookmark ribbon on any story to save it here."
              : "No articles matched your search query. Try searching for keywords like 'brain', 'AI', or 'memory'."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-surface-container rounded-xl text-xs font-label font-semibold text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const isBookmarked = bookmarkedIds.includes(art.id);
            return (
              <div
                key={art.id}
                onClick={() => handleReadArticle(art)}
                className="group bg-surface hover:bg-surface-container-low/40 rounded-2xl border border-outline-variant p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md cursor-pointer relative"
              >
                {/* Top Bar: Category & Bookmark */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-label font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      art.category === "brain"
                        ? "bg-primary-container text-on-primary-container"
                        : art.category === "tech"
                        ? "bg-secondary-container text-on-secondary-container"
                        : art.category === "science"
                        ? "bg-warning-container text-warning"
                        : "bg-surface-container text-on-surface"
                    }`}
                  >
                    {art.categoryLabel}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(art.id, e)}
                    title={isBookmarked ? "Remove Bookmark" : "Save Article"}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={16} className="text-primary" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs font-body text-on-surface-variant line-clamp-3">
                    {art.snippet}
                  </p>

                  {/* 2 Takeaways Preview */}
                  <div className="mt-2 pt-2 border-t border-outline-variant/60 flex flex-col gap-1.5">
                    <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <Sparkles size={10} className="text-primary" /> AI Takeaways:
                    </span>
                    <ul className="space-y-1">
                      {art.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] font-label text-on-surface flex items-start gap-1.5 leading-tight"
                        >
                          <span className="text-primary font-bold shrink-0">•</span>
                          <span className="line-clamp-1">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-outline-variant flex items-center justify-between text-[11px] font-label text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{art.readTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onLoadArticleToStudy && (
                      <button
                        type="button"
                        onClick={(e) => handleTransformArticle(art, e)}
                        title="Load into StudyFlow to make Flashcards & Quizzes"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-container text-on-primary-container font-bold hover:bg-primary hover:text-on-primary transition-all text-xs cursor-pointer shadow-xs"
                      >
                        <Flame size={12} />
                        <span>Study</span>
                      </button>
                    )}
                    <span className="text-primary font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Article Reader Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-surface border border-outline-variant rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-label font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-full bg-primary-container">
                  {activeArticleModal.categoryLabel}
                </span>
                <span className="text-xs font-label text-on-surface-variant">
                  • {activeArticleModal.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeArticleModal)}
                  title="Copy share summary"
                  className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check size={16} className="text-secondary" /> : <Share2 size={16} />}
                </button>
                <button
                  type="button"
                  onClick={(e) => toggleBookmark(activeArticleModal.id, e)}
                  title="Save article"
                  className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {bookmarkedIds.includes(activeArticleModal.id) ? (
                    <BookmarkCheck size={18} className="text-primary" />
                  ) : (
                    <Bookmark size={18} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setActiveArticleModal(null);
                  }}
                  className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
                  {activeArticleModal.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-xs font-label text-on-surface-variant">
                  <span>By {activeArticleModal.author}</span>
                  <span>•</span>
                  <span>{activeArticleModal.published}</span>
                </div>
              </div>

              {/* AI Key Takeaways Box */}
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-label font-bold text-primary uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>AI Executive Summary &amp; Key Takeaways</span>
                </div>
                <ul className="space-y-2 mt-2">
                  {activeArticleModal.keyTakeaways.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-xs font-label text-on-surface flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Content */}
              <div className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-line space-y-4">
                {activeArticleModal.fullContent}
              </div>

              {/* Glossary Terms */}
              {activeArticleModal.glossary.length > 0 && (
                <div className="border-t border-outline-variant pt-5 space-y-3">
                  <h4 className="font-headline text-base font-bold text-on-surface">
                    Key Academic Terminology
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeArticleModal.glossary.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-surface-container-low rounded-xl border border-outline-variant"
                      >
                        <p className="text-xs font-label font-bold text-primary">{item.term}</p>
                        <p className="text-[11px] font-label text-on-surface-variant mt-0.5">
                          {item.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Thinking Question */}
              <div className="p-4 bg-primary-container/40 rounded-2xl border border-primary/20 flex items-start gap-3">
                <Brain size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-label font-bold text-primary uppercase tracking-wider">
                    Critical Thinking Challenge
                  </span>
                  <p className="text-xs font-label text-on-surface mt-0.5">
                    {activeArticleModal.studyPrompt}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-outline-variant bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-label text-on-surface-variant">
                Transform this article into flashcards &amp; quiz arena battles.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveArticleModal(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-outline-variant text-xs font-label font-semibold text-on-surface hover:bg-surface-container transition-all cursor-pointer"
                >
                  Close
                </button>
                {onLoadArticleToStudy && (
                  <button
                    type="button"
                    onClick={() => handleTransformArticle(activeArticleModal)}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Flame size={14} />
                    <span>⚡ Transform into Study Flow</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
