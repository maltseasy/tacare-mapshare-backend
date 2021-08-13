"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conservation_1 = __importDefault(require("../models/conservation"));
const branch_1 = __importDefault(require("../models/branch"));
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = require("crypto");
const commit_1 = __importDefault(require("../models/commit"));
const createError = require("http-errors");
const middleware_1 = require("../utils/middleware");
const branchRouter = require("express").Router();
branchRouter.get("/conservations", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conservations = yield conservation_1.default.find({}).exec();
        res.json(conservations);
    }
    catch (e) {
        next(e);
    }
}));
branchRouter.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const branches = yield branch_1.default.find({}).exec();
        res.json(branches);
    }
    catch (e) {
        next(e);
    }
}));
branchRouter.post("/create", middleware_1.tokenAuthenticator, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.uid).exec();
    const { branchNote, commitNote, features, conservationSlug } = req.body;
    if (user) {
        const branchSlug = crypto_1.randomBytes(8).toString("hex");
        const branch = new branch_1.default({
            conservationSlug: conservationSlug ? conservationSlug : "schweinfurthii",
            slug: branchSlug,
            owner: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: req.uid,
            },
            note: branchNote,
        });
        const commitSlug = crypto_1.randomBytes(8).toString("hex");
        const initCommit = new commit_1.default({
            branchSlug: branchSlug,
            slug: commitSlug,
            note: commitNote,
            features: features,
            order: 0,
        });
        yield branch.save();
        yield initCommit.save();
        res.sendStatus(200);
    }
    else {
        next(createError(406, "User does not exist within database."));
    }
}));
branchRouter.post("/commit", middleware_1.tokenAuthenticator, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.uid).exec();
    const { branchSlug, commitNote, features } = req.body;
    if (user) {
        const maxCommit = yield commit_1.default.findOne({ branchSlug: branchSlug }).sort({ order: -1 }).exec();
        let order = 1;
        if (maxCommit) {
            order = maxCommit.order + 1;
        }
        const commitSlug = crypto_1.randomBytes(8).toString("hex");
        const commit = new commit_1.default({
            branchSlug: branchSlug,
            slug: commitSlug,
            note: commitNote,
            features: features,
            order: order,
        });
        yield commit.save();
        res.sendStatus(200);
    }
    else {
        next(createError(406, "User does not exist within database."));
    }
}));
branchRouter.get("/:id/commits", middleware_1.tokenAuthenticator, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.uid).exec();
    if (user) {
        const commits = yield commit_1.default.find({ branchSlug: req.params.id }).sort({ order: -1 }).exec();
        res.json(commits);
    }
    else {
        next(createError(406, "User does not exist within database."));
    }
}));
branchRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const branch = yield branch_1.default.findOne({ slug: req.params.id }).exec();
    res.json(branch);
}));
branchRouter.delete("/:id", middleware_1.tokenAuthenticator, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.uid).exec();
    if (user) {
        const branch = yield branch_1.default.findOne({ slug: req.params.id }).exec();
        if (branch) {
            branch.status = 2;
            yield branch.save();
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    }
    else {
        next(createError(406, "User does not exist within database."));
    }
}));
branchRouter.delete("/commit/:id", middleware_1.tokenAuthenticator, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.uid).exec();
    if (user) {
        const commit = yield commit_1.default.findOne({ slug: req.params.id }).exec();
        if (commit) {
            const branch = yield branch_1.default.findOne({ slug: commit.branchSlug }).exec();
            if (branch) {
                yield commit_1.default.deleteMany({ branchSlug: branch.slug, order: { $gt: commit.order } }).exec();
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        }
        else {
            res.sendStatus(400);
        }
    }
    else {
        next(createError(406, "User does not exist within database."));
    }
}));
branchRouter.get("/merge/:id", middleware_1.tokenAuthenticator, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.uid).exec();
    if (user) {
        // add checks for audit status
        const branch = yield branch_1.default.findOne({ slug: req.params.id }).exec();
        const relevantCommit = yield commit_1.default.findOne({ branchSlug: req.params.id }).sort({ order: -1 }).exec();
        const maxCommit = yield commit_1.default.findOne({ branchSlug: "main" }).sort({ order: -1 }).exec();
        const commitSlug = crypto_1.randomBytes(8).toString("hex");
        let order = 1;
        if (maxCommit) {
            order = maxCommit.order + 1;
        }
        const mergeCommit = new commit_1.default({
            branchSlug: "main",
            slug: commitSlug,
            note: relevantCommit === null || relevantCommit === void 0 ? void 0 : relevantCommit.note,
            features: relevantCommit === null || relevantCommit === void 0 ? void 0 : relevantCommit.features,
            order: order,
        });
        if (branch) {
            branch.status = 1;
            yield branch.save();
        }
        yield mergeCommit.save();
        res.sendStatus(200);
    }
    else {
        next(createError(406, "User does not exist within database."));
    }
}));
exports.default = branchRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vY29udHJvbGxlcnMvYnJhbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMEVBQWtEO0FBQ2xELDhEQUFzQztBQUN0QywwREFBa0M7QUFDbEMsbUNBQW1DO0FBQ25DLDhEQUFzQztBQUN0QyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0Msb0RBQXVEO0FBRXZELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVqRCxZQUFZLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUMxRCxJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxzQkFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6RCxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3pCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDVDtBQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7QUFFSCxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDaEQsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBRUgsWUFB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