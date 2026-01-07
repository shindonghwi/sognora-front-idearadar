'use client';

import { motion } from 'framer-motion';
import styles from './idea-card.module.css';

interface Idea {
  id: string;
  title: string;
  score: number;
  category: string;
  source: string;
  date: string;
}

interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return styles.scoreHigh;
    if (score >= 70) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <motion.div
      className={styles.card}
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.header}>
        <span className={styles.category}>{idea.category}</span>
        <span className={`${styles.score} ${getScoreColor(idea.score)}`}>
          {idea.score}
        </span>
      </div>

      <h3 className={styles.title}>{idea.title}</h3>

      <div className={styles.footer}>
        <span className={styles.source}>{idea.source}</span>
        <span className={styles.date}>{idea.date}</span>
      </div>
    </motion.div>
  );
}
