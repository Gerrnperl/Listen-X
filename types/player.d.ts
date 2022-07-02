interface PlayerState {
	playing: boolean;
	activeMusic: music;
	playingList: music[];
	current: number;
}

type ProgressControllerProps = Readonly<any> & Readonly<{
	children?: React.ReactNode;
	handleProgress: (second: number)=>void,
	handlePlay: ()=>void,
	current: number; 
	duration: number;
}>

type ProgressBarProps = Readonly<any> & Readonly<{
	children?: React.ReactNode;
	handleProgress: (second: number)=>void,
	current: number; 
	duration: number;
}>

type ProgressSliderProps = Readonly<any> & Readonly<{
	children?: React.ReactNode;
	handleProgress: (second: number)=>void,
	duration: number;
	leftMax: number;
	rightMax: number;
	range: number;
}>