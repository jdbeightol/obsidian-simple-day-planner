import {
    App,
    PluginSettingTab,
    Setting
} from 'obsidian';
import MomentDateRegex from './moment-date-regex';
import type DayPlanner from './main';
import { TIMELINE_DEFAULT_ZOOM } from './constants';
  
export class DayPlannerSettingsTab extends PluginSettingTab {
    momentDateRegex = new MomentDateRegex();
    plugin: DayPlanner;
    constructor(app: App, plugin: DayPlanner) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
        .setName('Status Bar - Circular Progress')
        .setDesc('Display a circular progress bar in the status bar')
        .addToggle(toggle => 
            toggle
            .setValue(this.plugin.settings.circularProgress)
            .onChange((value:boolean) => {
                this.plugin.settings.circularProgress = value;
                this.plugin.saveData(this.plugin.settings);
            }));

        new Setting(containerEl)
            .setName('Status Bar - Now and Next')
            .setDesc('Display now and next tasks in the status bar')
            .addToggle(toggle => 
            toggle
                .setValue(this.plugin.settings.nowAndNextInStatusBar)
                .onChange((value:boolean) => {
                this.plugin.settings.nowAndNextInStatusBar = value;
                this.plugin.saveData(this.plugin.settings);
                }));

        new Setting(containerEl)
            .setName('Task Notification')
            .setDesc('Display a notification when a new task is started')
            .addToggle(toggle => 
            toggle
                .setValue(this.plugin.settings.showTaskNotification)
                .onChange((value:boolean) => {
                this.plugin.settings.showTaskNotification = value;
                this.plugin.saveData(this.plugin.settings);
                }));

        new Setting(containerEl)
            .setName('Timeline Zoom Level')
            .setDesc('The zoom level to display the timeline. The higher the number, the more vertical space each task will take up.')
            .addSlider(slider => 
            slider
                .setLimits(1, 5, 1)
                .setValue(this.plugin.settings.timelineZoomLevel ?? TIMELINE_DEFAULT_ZOOM)
                .setDynamicTooltip()
                .onChange((value:number) => {
                this.plugin.settings.timelineZoomLevel = value;
                this.plugin.saveData(this.plugin.settings);
                }));
    }

    private addDocsLink(descEl: DocumentFragment) {
        const a = document.createElement('a');
        a.href = 'https://github.com/jdbeightol/obsidian-simple-day-planner/blob/main/README.md';
        a.text = 'plugin README';
        a.target = '_blank';
        descEl.appendChild(a);
        descEl.appendChild(document.createElement('br'));
    }
}
