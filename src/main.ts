import {
  Plugin,
  TAbstractFile,
  Vault,
  WorkspaceLeaf, 
} from 'obsidian';
import { DayPlannerSettingsTab } from './settings-tab';
import { DayPlannerSettings, NoteForDateQuery } from './settings';
import StatusBar from './status-bar';
import Progress from './progress';
import PlannerMarkdown from './planner-md';
import DayPlannerFile from './file';
import Parser from './parser';
import { VIEW_TYPE_TIMELINE } from './constants';
import TimelineView from './timeline-view';

export default class DayPlanner extends Plugin {
    settings: DayPlannerSettings;
    vault: Vault;
    file: DayPlannerFile;
    plannerMD: PlannerMarkdown;
    statusBar: StatusBar; 
    notesForDatesQuery: NoteForDateQuery;
    timelineView: TimelineView;
    
    async onload() {
        console.log("Loading Simple Day Planner plugin");
        this.vault = this.app.vault;
        this.settings = Object.assign(new DayPlannerSettings(), await this.loadData());
        this.notesForDatesQuery = new NoteForDateQuery();
        this.file = new DayPlannerFile(this.vault, this.settings);
        const progress = new Progress();
        const parser = new Parser(this.settings);
        this.plannerMD = new PlannerMarkdown(this.app.workspace, this.settings, this.file, parser, progress)
        this.statusBar = new StatusBar(
            this.settings,
            this.addStatusBarItem(), 
            this.app.workspace, 
            progress,
            new PlannerMarkdown(this.app.workspace, this.settings, this.file, parser, progress),
            this.file
        );

        this.statusBar.initStatusBar();
        this.registerEvent(this.app.vault.on('modify', this.codeMirror, ''));

        this.addCommand({
            id: 'app:show-day-planner-timeline',
            name: 'Show timeline',
            callback: () => this.initLeaf(),
            hotkeys: []
        });

        this.registerView(
        VIEW_TYPE_TIMELINE,
        (leaf: WorkspaceLeaf) =>
            (this.timelineView = new TimelineView(leaf, this.settings))
        );

        this.addSettingTab(new DayPlannerSettingsTab(this.app, this));
        this.registerInterval(window.setInterval(async () => {
            try {
                if(this.file.hasTodayNote()){
                    // console.log('Active note found, starting file processing')
                    const planSummary = await this.plannerMD.parseDayPlanner();
                    planSummary.calculate();
                    await this.statusBar.refreshStatusBar(planSummary)
                    this.timelineView && this.timelineView.update(planSummary);
            }
            } catch (error) {
                console.log(error)
            }
        }, 2000));

        if (this.app.workspace.layoutReady) {
            this.initLeaf();
        } else {
            this.app.workspace.onLayoutReady(() => this.initLeaf());
        }
    }

    initLeaf() {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE_TIMELINE).length > 0) {
            return;
        }
        this.app.workspace.getRightLeaf(true).setViewState({
            type: VIEW_TYPE_TIMELINE,
        });
    }

    codeMirror = (file: TAbstractFile) => {
        if(this.file.hasTodayNote()) {
            // console.log('Active note found, starting CodeMirror monitoring')
            this.plannerMD.checkIsDayPlannerEditing();
        } else {
            // console.log('No active note, skipping CodeMirror monitoring')
        }
    }
        
    onunload() {
        console.log("Unloading Simple Day Planner plugin");
        this.app.workspace
        .getLeavesOfType(VIEW_TYPE_TIMELINE)
        .forEach((leaf) => leaf.detach());
    }
}
