import { PharmacyIndexOptions } from '../../@types/QueryOptions';
import Pharmacy from '../entities/Pharmacy';

export default interface IPharmacyRepository {
    getById(id: string): Promise<Pharmacy | undefined>;
    getAll(query?: PharmacyIndexOptions): Promise<{ pharmacies: Pharmacy[]; totalPharmacies: number }>;
    getAllByName(name: string): Promise<Pharmacy[]>;
    save(pharmacy: Pharmacy): Promise<Pharmacy>;
    index(query?: PharmacyIndexOptions): Promise<{ data: Pharmacy[]; count: number }>;
    create(pharmacy: Pharmacy): Promise<Pharmacy>;
    update(id: string, pharmacy: Omit<Pharmacy, "id">): Promise<Pharmacy>;
    delete(id: string): Promise<void>;
}