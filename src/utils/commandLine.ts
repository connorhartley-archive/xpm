'use strict';

import blessed = require('blessed');

export function createMessageBox(view: blessed.widget.Screen): MessageBoxMethods {
	let message: blessed.widget.Box = null;
	const messageText: blessed.widget.Box[] = [];

	(<MessageBoxMethods> add).add = add;
	(<MessageBoxMethods> add).edit = edit;
	(<MessageBoxMethods> add).remove = remove;
	return <MessageBoxMethods> add;

	function add (text: string, id: number) {
		if (!message) {
			message = blessed.box({ width: view.width, top: id, left: 'center' });
		}

		message.top = id;

		const line = blessed.box({ height: 1, top: id, left: 1, right: 1, content: text, tags: true });

		message.append(line);
		view.append(message);

		view.on('resize', function() {
			message.width = view.width;
			view.render();
		});

		message.show();
		line.show();

		messageText[id] = line;

		view.render();

		return id;
	}

	function edit (text: string, id: number) {
		const msgTxt = messageText[id];

		msgTxt.setContent(text);
		msgTxt.show();

		messageText[id] = msgTxt;

		view.render();

		return id;
	}

	function remove (id: number) {
		const msgTxt = messageText[id];

		msgTxt.destroy();

		view.render();
	}
}

export interface MessageBoxMethods {
	(text: string, id?: number): number;
	add(text: string, id?: number): number;
	edit(text: string, id: number): void;
	remove(id: number): void;
}
