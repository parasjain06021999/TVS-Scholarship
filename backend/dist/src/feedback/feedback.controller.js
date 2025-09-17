"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let FeedbackController = class FeedbackController {
    async sendFeedback(body, req) {
        try {
            console.log('Feedback sent for application:', body.applicationId);
            console.log('Feedback type:', body.type);
            console.log('Feedback message:', body.message);
            console.log('Sent by:', req.user.id);
            return {
                success: true,
                message: 'Feedback sent successfully',
                data: {
                    applicationId: body.applicationId,
                    type: body.type,
                    message: body.message,
                    sentBy: req.user.id,
                    sentAt: new Date().toISOString(),
                }
            };
        }
        catch (error) {
            console.error('Error sending feedback:', error);
            return {
                success: false,
                message: error.message || 'Failed to send feedback',
            };
        }
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "sendFeedback", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('feedback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map