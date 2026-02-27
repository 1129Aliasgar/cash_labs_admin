import { Schema, model } from 'mongoose';
import { IOrganisation } from '../../types/Organisation.types';

/**
 * Organisation Schema
 * @description Schema for the Organisation model
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 * @since 1.0.0
 */
const organisationSchema = new Schema<IOrganisation>({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    addressLine1: {
        type: String,
        required: false
    },
    addressLine2: {
        type: String,
        required: false
    },
    addressLine3: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    postalCode: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    countryCode: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

organisationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Indexes for efficient queries
organisationSchema.index({ name: 1 });
organisationSchema.index({ email: 1 });
organisationSchema.index({ countryCode: 1 });
organisationSchema.index({ createdAt: -1 });

export const Organisation = model<IOrganisation>('Organisation', organisationSchema);
export default organisationSchema;
