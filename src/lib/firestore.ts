import { doc, getDoc, setDoc, updateDoc, increment, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  email: string | null;
  createdAt: string;
}

export interface SkillProgress {
  lessonsCompleted: number;
  quizScore: number;
}

export const createUserProfile = async (userId: string, email: string | null) => {
  const userRef = doc(db, `users/${userId}/profile`, "details");
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      email,
      createdAt: new Date().toISOString(),
    });
  }
};

export const getSkillProgress = async (userId: string, skillName: string): Promise<SkillProgress | null> => {
  const progressRef = doc(db, `users/${userId}/progress`, skillName);
  const docSnap = await getDoc(progressRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as SkillProgress;
  }
  return null;
};

export const getAllSkillProgress = async (userId: string): Promise<Record<string, SkillProgress>> => {
  const querySnapshot = await getDocs(collection(db, `users/${userId}/progress`));
  const progress: Record<string, SkillProgress> = {};
  querySnapshot.forEach((doc) => {
    progress[doc.id] = doc.data() as SkillProgress;
  });
  return progress;
};

export const incrementLessonComplete = async (userId: string, skillName: string) => {
  const progressRef = doc(db, `users/${userId}/progress`, skillName);
  const docSnap = await getDoc(progressRef);

  if (!docSnap.exists()) {
    await setDoc(progressRef, {
      lessonsCompleted: 1,
      quizScore: 0
    });
  } else {
    await updateDoc(progressRef, {
      lessonsCompleted: increment(1)
    });
  }
};

export const updateQuizScore = async (userId: string, skillName: string, score: number) => {
  const progressRef = doc(db, `users/${userId}/progress`, skillName);
  const docSnap = await getDoc(progressRef);

  if (!docSnap.exists()) {
    await setDoc(progressRef, {
      lessonsCompleted: 0,
      quizScore: score
    });
  } else {
    await updateDoc(progressRef, {
      quizScore: score
    });
  }
};
