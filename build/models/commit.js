"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commitSchema = new mongoose_1.Schema({
    branchSlug: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    note: { type: String },
    geometry: { type: String, required: true },
    attributes: {
        ID_NO: { type: Number },
        NAME: { type: String },
        POPULATION: { type: Number },
        SUBSPECIES: { type: String },
        BINOMIAL: { type: String },
        CITATION: { type: String },
        COMPILER: { type: String },
        YEAR: { type: Number }
    },
    order: { type: Number, required: true, default: 0 }
}, { timestamps: true });
const Commit = mongoose_1.model("Commit", commitSchema);
exports.default = Commit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL2NvbW1pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpRDtBQWtCakQsTUFBTSxZQUFZLEdBQUcsSUFBSSxpQkFBTSxDQUFZO0lBQ3ZDLFVBQVUsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztJQUMxQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztJQUNsRCxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO0lBQ3BCLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztJQUN4QyxVQUFVLEVBQUU7UUFDUixLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO1FBQ3JCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7UUFDcEIsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQztRQUMxQixVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO1FBQzFCLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7UUFDeEIsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQztRQUN4QixRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO1FBQ3hCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7S0FDdkI7SUFDRCxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztDQUNwRCxFQUFFLEVBQUMsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFFdkIsTUFBTSxNQUFNLEdBQUcsZ0JBQUssQ0FBWSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDeEQsa0JBQWUsTUFBTSxDQUFDIn0=