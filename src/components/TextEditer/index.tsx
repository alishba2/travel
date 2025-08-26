/* eslint-disable no-shadow */
import React, { useState, FC } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, EditorState } from 'draft-js';
import * as S from './styled';
import { CustomSetState } from '@typings/base';

interface IProps {
	editorState: any;
	setEditorState: CustomSetState<any>;
}

const toolbarOptions = {
	options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'emoji', 'colorPicker'],
	inline: { inDropdown: false },
	list: { inDropdown: false },
	textAlign: { inDropdown: false },
	link: { inDropdown: false },
	history: { inDropdown: false },
	image: {
		alt: { present: false, mandatory: false },
	},
};

const TextEditer: FC<IProps> = ({ editorState, setEditorState }) => {
	/**
	 * States
	 */

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const onEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
	};

	/**
	 * Helpers
	 */

	return (
		<S.Container>
			<Editor
				editorState={editorState}
				onEditorStateChange={onEditorStateChange}
				toolbar={toolbarOptions}
				wrapperClassName="demo-wrapper"
				editorClassName="demo-editor"
				toolbarClassName="toolbar-class"
				placeholder="Please enter the comment."
			/>
		</S.Container>
	);
};

export default TextEditer;
