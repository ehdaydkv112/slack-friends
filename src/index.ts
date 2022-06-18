import cron from 'node-cron';
import axios, { AxiosError } from 'axios';
import { ChannelValueType, Config, MessageType } from './types';

const sendSlackChannel = async (url: string, token: string, data: { [key: string]: any }) => {
	const result = await axios({
		method: "POST",
		url,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		data,
	})

	if (!result.data.ok) throw new Error(JSON.stringify(result.data));
	return result.data;
};


export class SlackFriends {
	token;
	channelName;
	channel = '';
	constructor(config: Config) {
		this.token = config.token;
		this.channelName = config.channel;
		this.setChannel();
	}

	private async setChannel() {
		const response = await axios({
			url: "https://slack.com/api/conversations.list",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});
		const channel = response.data.channels.find((value: ChannelValueType) => {
			return value.name === this.channelName;
		});

		if (!channel) {
			throw new Error("channel not found");
		}
		this.channel = channel.id;

		await sendSlackChannel(
			"https://slack.com/api/conversations.join",
			this.token,
			{
				channel: this.channel,
			}
		);
	}

	private async getMessageContent(message: MessageType): Promise<{ channel: string, text?: MessageType, post_at?: number }> {
		if (!this.channel) await this.setChannel();
		if (typeof message === "string") {
			return {
				channel: this.channel,
				text: message
			};
		}
		return { ...message, channel: this.channel };
	}

	async send(message: MessageType) {
		if (!this.channel) await this.setChannel();
		const data = await this.getMessageContent(message);
		sendSlackChannel(
			"https://slack.com/api/chat.postMessage",
			this.token,
			data
		);
	}

	async cron(config: string, message: MessageType) {
		if (!this.channel) await this.setChannel();
		const data = await this.getMessageContent(message);
		const nodeCron = cron.schedule(`${config}`, async () => {
			sendSlackChannel(
				"https://slack.com/api/chat.postMessage",
				this.token,
				data
			);
		});
		nodeCron.start();
	}

	async time(date: Date, message: MessageType) {
		if (!this.channel) await this.setChannel();
		const data = await this.getMessageContent(message);
		data.post_at = parseInt(`${date.getTime() / 1000}`);
		sendSlackChannel(
			"https://slack.com/api/chat.scheduleMessage",
			this.token,
			data
		);
	}
}
