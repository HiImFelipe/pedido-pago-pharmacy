import Pharmacy from '../entities/Pharmacy';

export default interface IPharmacyRepository {
    getById(id: string): Promise<Pharmacy | undefined>;
    save(pharmacy: Pharmacy): Promise<Pharmacy>;
    index(query: PharmacyIndexOptions): Promise<{ data: Pharmacy[]; count: number }>;
    create(pharmacy: Pharmacy): Promise<Pharmacy>;
    update(id: string, pharmacy: Omit<Pharmacy, "id">): Promise<Pharmacy>;
    delete(id: string): Promise<void>;
}