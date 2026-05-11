import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Ex: "Loja Roupas da Maria"
    slug: { type: String, required: true, unique: true }, // Ex: "roupas-maria"
    active: { type: Boolean, default: true }
}, { timestamps: true });

const Tenant = mongoose.model("tenant", tenantSchema);

export default Tenant;
