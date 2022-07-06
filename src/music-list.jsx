import React from 'react';
import {
	DetailsList,
	Selection,
	SelectionMode,
	IColumn,
	buildColumns,
	checkboxVisibility,
	IColumnReorderOptions,
	IDragDropEvents,
	IDragDropContext,
	CheckboxVisibility,
} from '@fluentui/react/lib/DetailsList';
import {MarqueeSelection} from '@fluentui/react/lib/MarqueeSelection';
import {TextField, ITextFieldStyles} from '@fluentui/react/lib/TextField';
import {Toggle, IToggleStyles} from '@fluentui/react/lib/Toggle';
import {getTheme, mergeStyles} from '@fluentui/react/lib/Styling';
import Helper from './utils/helper';
import {ProviderContext} from './App';
import Utils from './utils/utils';

class MusicList extends React.Component{

	#dragDropEvents;

	#selection;

	#draggedItem;

	#draggedIndex;

	/** @type {IColumn[]} */
	columns = {
		provider: {
			key: 'column-provider',
			name: '',
			className: 'column column-provider',
			minWidth: 26,
			maxWidth: 26,
			onRender: (item) => {
				let name = item.provider;
				let displayName = this.context?.[name]?.displayName;

				return (
					<span
						className={'provider-displayName'}
						style={{
							fontSize: Utils.style.fontSize.tiny,
						}}
					>{displayName}</span>);
			},
			isPadded: false,
		},
		musicName: {
			key: 'column-musicName',
			name: 'Name',
			className: 'column column-name',
			minWidth: 210,
			maxWidth: 350,
			isRowHeader: true,
			isResizable: true,
			data: 'string',
			onRender: (item) => {
				return <span>{item.musicName}</span>;
			},
			isPadded: true,
		},
		artistList: {
			key: 'column-artistList',
			name: 'Artists',
			minWidth: 70,
			maxWidth: 90,
			isResizable: true,
			onColumnClick: this._onColumnClick,
			data: 'string',
			onRender: (item) => {
				return <span>{item.artistList.join(', ')}</span>;
			},
			isPadded: true,
		},
		albumName: {
			key: 'column-albumName',
			name: 'Album',
			minWidth: 70,
			maxWidth: 90,
			isResizable: true,
			isCollapsible: true,
			data: 'string',
			onRender: (item) => {
				return <span>{item.albumName}</span>;
			},
			isPadded: true,
		},
		duration: {
			key: 'column-duration',
			name: 'Duration',
			minWidth: 70,
			maxWidth: 90,
			isResizable: true,
			isCollapsible: true,
			data: 'number',
			onColumnClick: this._onColumnClick,
			onRender: (item) => {
				return <span>{Helper.formatTime(item.duration)}</span>;
			},
		},
	};

	constructor(props){
		super(props);


		let setColumns = [];

		if(this.props.columns){
			this.props.columns.forEach(header =>{
				setColumns.push(this.columns[header]);
			});
		}
		else{
			for (const header in this.columns){
				if (Object.hasOwnProperty.call(this.columns, header)){
					setColumns.push(this.columns[header]);
				}
			}
		}

		this.state = {
			columns: setColumns,
			/** @type {music[]} */
			musicList: props.list,
		};

		this.#dragDropEvents = this.#getDragDropEvents();
		this.#selection = new Selection({
			onSelectionChanged: () => {
				this.setState({
					selectionDetails: this.#getSelectionDetails(),
				});
			},
		});


		this.setState({
			columns: setColumns,
		});

		MusicList.contextType = ProviderContext;
	}

	render(){
		return (
			<DetailsList
				setKey="items"
				items={this.state.musicList}
				columns={this.state.columns}
				compact={this.props.compact ?? false}
				selection={this.#selection}
				selectionMode={SelectionMode.multiple}
				selectionPreservedOnEmptyClick={true}
				checkboxVisibility={CheckboxVisibility.hidden}
				onItemInvoked={this.#onItemInvoked}
				onRenderItemColumn={this.#onRenderItemColumn}
				isHeaderVisible={this.props.isHeaderVisible ?? false}
				dragDropEvents={this.#dragDropEvents}
				ariaLabelForSelectionColumn="Toggle selection"
				ariaLabelForSelectAllCheckbox="Toggle selection for all items"
				checkButtonAriaLabel="select row"
			/>
		);
	}

	#getSelectionDetails(){
		const selectionCount = this.#selection.getSelectedCount();

		switch (selectionCount){
		case 0:
			return 'No items selected';
		case 1:
			return '1 item selected: ' + (this.#selection.getSelection()[0]).name;
		default:
			return `${selectionCount} items selected`;
		}
	}

	/**
	 * 
	 * @param {string} value 
	 * @returns {string}
	 */
	#validateNumber(value){
		return isNaN(Number(value)) ? `The value should be a number, actual is ${value}.` : '';
	}

	/**
	 * 
	 * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event 
	 * @param {string} text 
	 */
	#onChangeStartCountText(event, text){
		this.setState({frozenColumnCountFromStart: text});
	}

	/**
	 * 
	 * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} event 
	 * @param {string} text 
	 */
	#onChangeEndCountText(event, text){
		this.setState({frozenColumnCountFromEnd: text});
	}

	/**
	 * 
	 * @returns {IDragDropEvents}
	 */
	#getDragDropEvents(){
		return {
			/**
			 * 
			 * @param {?IDragDropContext} dropContext 
			 * @param {?IDragDropContext} dragContext 
			 * @returns {boolean}
			 */
			canDrop: (dropContext, dragContext) => {
				return true;
			},

			/**
			 * 
			 * @param {?*} item 
			 * @returns {boolean}
			 */
			canDrag: (item) => {
				return true;
			},

			/**
			 * 
			 * @param {?*} item 
			 * @param {?DragEvent} event 
			 * @returns 
			 */
			onDragEnter: (item, event) => {
				// return string is the css classes that will be added to the entering element.
				return dragEnterClass;
			},

			/**
			 * 
			 * @param {?*} item 
			 * @param {*} event 
			 */
			onDragLeave: (item, event) => {
				return;
			},

			/**
			 * 
			 * @param {?*} item 
			 * @param {DragEvent} event 
			 */
			onDrop: (item, event) => {
				if (this.#draggedItem){
					this.#insertBeforeItem(item);
				}
			},
			/**
			 * 
			 * @param {?*} item 
			 * @param {?number} itemIndex 
			 * @param {?*[]} selectedItems 
			 * @param {?MouseEvent} event 
			 */
			onDragStart: (item, itemIndex, selectedItems, event) => {
				this.#draggedItem = item;
				this.#draggedIndex = itemIndex;
			},
			/**
			 * 
			 * @param {?*} item 
			 * @param {?DragEvent} event 
			 */
			onDragEnd: (item, event) => {
				this.#draggedItem = undefined;
				this.#draggedIndex = -1;
			},
		};
	}

	/**
	 * 
	 * @param {*} item 
	 */
	#onItemInvoked(item){
		// todo: play
		console.log(`Item invoked: ${item.musicName} ${item.id}`);
	}

	/**
	 * 
	 * @param {*} item 
	 * @param {number} index 
	 * @param {IColumn} column 
	 * @returns {JSX.Element | string}
	 */
	#onRenderItemColumn(item, index, column){
		/** @type {*} */
		const key = column.key;

		return String(item[key]);
	}

	/**
	 * 
	 * @param {*} item 
	 */
	#insertBeforeItem(item){
		const draggedItems = this.#selection.isIndexSelected(this.#draggedIndex)
			? (this.#selection.getSelection())
			: [this.#draggedItem];

		const insertIndex = this.state.musicList.indexOf(item);
		const items = this.state.musicList.filter(itm => draggedItems.indexOf(itm) === -1);

		items.splice(insertIndex, 0, ...draggedItems);

		this.setState({musicList: items});
	}

}


export {MusicList};