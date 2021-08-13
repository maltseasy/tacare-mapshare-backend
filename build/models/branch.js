"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const branchSchema = new mongoose_1.Schema(
  {
    conservationSlug: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    owner: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      id: { type: String, required: true },
    },
    note: { type: String, required: true },
    auditStatus: {
      status: { type: Number, required: true, default: 0 },
      approvals: { type: Number, required: true, default: 0 },
      denials: { type: Number, required: true, default: 0 },
      pending: { type: Number, required: true, default: 0 },
      envelopeId: { type: String, default: "" },
    },
    status: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
const Branch = mongoose_1.model("Branch", branchSchema);
exports.default = Branch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL2JyYW5jaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpRDtBQW9CakQsTUFBTSxZQUFZLEdBQUcsSUFBSSxpQkFBTSxDQUM3QjtJQUNFLGdCQUFnQixFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO0lBQ2hELElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0lBQ2xELEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztRQUN6QyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7UUFDeEMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ3JDLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztLQUNuQztJQUNELElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztJQUNwQyxXQUFXLEVBQUU7UUFDWCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztRQUNsRCxTQUFTLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztRQUNyRCxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztRQUNuRCxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztRQUNuRCxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUM7S0FDeEM7SUFDRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztDQUNuRCxFQUNELEVBQUMsVUFBVSxFQUFFLElBQUksRUFBQyxDQUNuQixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsZ0JBQUssQ0FBWSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDeEQsa0JBQWUsTUFBTSxDQUFDIn0=
