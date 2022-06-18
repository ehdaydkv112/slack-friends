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
exports.SlackFriends = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const sendSlackChannel = (url, token, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, axios_1.default)({
        method: "POST",
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data,
    });
    if (!result.data.ok)
        throw new Error(JSON.stringify(result.data));
    return result.data;
});
class SlackFriends {
    constructor(config) {
        this.channel = '';
        this.token = config.token;
        this.channelName = config.channel;
        this.setChannel();
    }
    setChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, axios_1.default)({
                url: "https://slack.com/api/conversations.list",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            const channel = response.data.channels.find((value) => {
                return value.name === this.channelName;
            });
            if (!channel) {
                throw new Error("channel not found");
            }
            this.channel = channel.id;
            yield sendSlackChannel("https://slack.com/api/conversations.join", this.token, {
                channel: this.channel,
            });
        });
    }
    getMessageContent(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                yield this.setChannel();
            if (typeof message === "string") {
                return {
                    channel: this.channel,
                    text: message
                };
            }
            return Object.assign(Object.assign({}, message), { channel: this.channel });
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                yield this.setChannel();
            const data = yield this.getMessageContent(message);
            sendSlackChannel("https://slack.com/api/chat.postMessage", this.token, data);
        });
    }
    cron(config, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                yield this.setChannel();
            const data = yield this.getMessageContent(message);
            const nodeCron = node_cron_1.default.schedule(`${config}`, () => __awaiter(this, void 0, void 0, function* () {
                sendSlackChannel("https://slack.com/api/chat.postMessage", this.token, data);
            }));
            nodeCron.start();
        });
    }
    time(date, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                yield this.setChannel();
            const data = yield this.getMessageContent(message);
            data.post_at = parseInt(`${date.getTime() / 1000}`);
            sendSlackChannel("https://slack.com/api/chat.scheduleMessage", this.token, data);
        });
    }
}
exports.SlackFriends = SlackFriends;
