import { Document } from 'mongoose';

/**
 * Organisation interface
 * @description Type for the Organisation model
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 * @since 1.0.0
 */
export interface IOrganisation extends Document {
    name: string;
    website?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    countryCode?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
