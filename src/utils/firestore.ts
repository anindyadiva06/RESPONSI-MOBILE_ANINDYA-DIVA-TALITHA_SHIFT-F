// src/utils/firestore.ts
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// interface data
export interface Hero {
    id?: string;
    title: string;
    description: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// operasi CRUD
export const firestoreService = {
    // get collection ref
    getHeroRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'heros');
    },

		// create
    async addHero(hero: Omit<Hero, 'id'>) {
        try {
            const heroRef = this.getHeroRef();
            const docRef = await addDoc(heroRef, {
                ...hero,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Hero:', error);
            throw error;
        }
    },

		// read
    async getHeros(): Promise<Hero[]> {
        try {
            const heroRef = this.getHeroRef();
            const q = query(heroRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Hero));
        } catch (error) {
            console.error('Error Get Heros:', error);
            throw error;
        }
    },

		// update
    async updateHero(id: string, hero: Partial<Hero>) {
        try {
            const heroRef = this.getHeroRef();
            const docRef = doc(heroRef, id);
            await updateDoc(docRef, {
                ...hero,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Hero:', error);
            throw error;
        }
    },

		// delete
    async deleteHero(id: string) {
        try {
            const heroRef = this.getHeroRef();
            const docRef = doc(heroRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Hero:', error);
            throw error;
        }
    },

		// update status
    async updateStatus(id: string, status: boolean) {
        try {
            const heroRef = this.getHeroRef();
            const docRef = doc(heroRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error Update Status:', error);
            throw error;
        }
    }

}