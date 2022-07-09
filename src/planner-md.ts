import type { Workspace } from 'obsidian';
import type DayPlannerFile from './file';
import type Parser from './parser';
import type { PlanSummaryData } from './plan-data';
import type Progress from './progress';
import { DayPlannerSettings, NoteForDateQuery} from './settings';

export default class PlannerMarkdown {
    workspace: Workspace;
    dayPlannerLastEdit: number;
    settings: DayPlannerSettings;
    file: DayPlannerFile;
    parser: Parser;
    progress: Progress;
    noteForDateQuery: NoteForDateQuery;

    constructor(workspace: Workspace, settings: DayPlannerSettings, file: DayPlannerFile, parser: Parser, progress: Progress){
        this.workspace = workspace;
        this.settings = settings;
        this.file = file;
        this.parser = parser;
        this.progress = progress;
        this.noteForDateQuery = new NoteForDateQuery();
    }

    async parseDayPlanner():Promise<PlanSummaryData> {
        try {
            const fileContent = await (await this.file.getFileContents()).split('\n');

            const planData = await this.parser.parseMarkdown(fileContent);
            return planData;
        } catch (error) {
            console.log(error)
        }
    }

    checkIsDayPlannerEditing(){
        const activeLeaf = this.workspace.activeLeaf;
        if(!activeLeaf){
            return;
        }
        const viewState = activeLeaf.view.getState();
        if(viewState.file === this.file.todayPlannerFilePath()){
            this.dayPlannerLastEdit = new Date().getTime();
        }
    }
}
