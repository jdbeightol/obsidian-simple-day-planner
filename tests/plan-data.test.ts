import 'mocha';
import { expect } from 'chai';

import { PlanItemFactory } from '../src/plan-data';
import { DayPlannerSettings } from '../src/settings';

describe('plan-data', () => {
  describe('PlanItemFactory', () => {
    const matchIndex = 1;
    const charIndex = 0;
    const isBreak = false;
    const isEnd = false;
    const time = new Date('2021-04-11T11:10:00.507Z');
    const rawTime = '11:10';
    const text = 'meeting';
    const raw = '- 11:10 meeting';

    it('should generate PlanItem with given text', () => {
      const factory = new PlanItemFactory(new DayPlannerSettings());

      const item = factory.getPlanItem(matchIndex, charIndex, isBreak, isEnd, time, rawTime, text, raw);

      expect(item.matchIndex).to.eql(matchIndex);
      expect(item.charIndex).to.eql(charIndex);
      expect(item.isBreak).to.eql(isBreak);
      expect(item.isEnd).to.eql(isEnd);
      expect(item.time).to.eql(time);
      expect(item.rawTime).to.eql(rawTime);
      expect(item.text).to.eql(text);
      expect(item.raw).to.eql(raw);
    });
  });

  // TODO need a test for sorted plan summary
});