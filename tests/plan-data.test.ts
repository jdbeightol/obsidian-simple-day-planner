import 'mocha';
import fc from 'fast-check';
import { expect } from 'chai';

import { PlanItemFactory } from '../src/plan-data';
import { DayPlannerSettings } from '../src/settings';
import { BREAK_LABEL, END_LABEL } from '../src/constants';

describe('plan-data', () => {
  describe('PlanItemFactory', () => {
    it('should generate PlanItem with given values', () => {
      fc.assert(
        fc.property(
            fc.integer(),
            fc.integer(),
            fc.date(),
            fc.string(),
            fc.string(),
            (matchIndex: number, charIndex: number, time: Date, rawTime: string, text: string) => {
              const factory = new PlanItemFactory(new DayPlannerSettings());
              const item = factory.getPlanItem(matchIndex, charIndex, false, false, time, rawTime, text, text);
              expect(item.matchIndex).to.eql(matchIndex);
              expect(item.charIndex).to.eql(charIndex);
              expect(item.time).to.eql(time);
              expect(item.rawTime).to.eql(rawTime);
              expect(item.text).to.eql(text);
              expect(item.raw).to.eql(text);
            }
        )
      );
    });

    it('should generate PlanItem with break label or end label text when break or end', () => {
      fc.assert(
        fc.property(
            fc.tuple(fc.boolean(), fc.boolean()).filter((i: [ boolean, boolean]) => !i[0] && !i[1]),
            fc.string(),
            (breakAndEnd: [boolean, boolean], text: string) => {
              var isBreak = breakAndEnd[0];
              var isEnd = breakAndEnd[1];
              const factory = new PlanItemFactory(new DayPlannerSettings());
              const item = factory.getPlanItem(0, 0, isBreak, isEnd, new Date(), "", text, text);
              expect(item.raw).to.eql(text);
              if (!isBreak && !isEnd) {
                expect(item.text).to.eql(text);
              }
              if (isBreak) {
                expect(item.text).to.eql(BREAK_LABEL);
                expect(item.text).to.not.eql(text);
              }
              if (isEnd) {
                expect(item.text).to.eql(END_LABEL);
                expect(item.text).to.not.eql(text);
              }
            }
        )
      );
    });
  });

  // TODO need a test for sorted plan summary
});