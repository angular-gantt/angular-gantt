import {GanttBodyColumns} from './bodyColumns.factory';
import {GanttBodyRows} from './bodyRows.factory';
import {GanttBodyBackground} from './bodyBackground.factory';
import {GanttBodyForeground} from './bodyForeground.factory';
import {Gantt} from '../gantt.factory';

export class GanttBody {
  static GanttBodyColumns: { new(GanttBody): GanttBodyColumns };
  static GanttBodyRows: { new(GanttBody): GanttBodyRows };
  static GanttBodyBackground: { new(GanttBody): GanttBodyBackground };
  static GanttBodyForeground: { new(GanttBody): GanttBodyForeground };

  private gantt: Gantt;

  private background: GanttBodyBackground;
  private foreground: GanttBodyForeground;
  private columns: GanttBodyColumns;
  private rows: GanttBodyRows;

  constructor(gantt: Gantt) {
    this.gantt = gantt;

    this.background = new GanttBody.GanttBodyBackground(this);
    this.foreground = new GanttBody.GanttBodyForeground(this);
    this.columns = new GanttBody.GanttBodyColumns(this);
    this.rows = new GanttBody.GanttBodyRows(this);
  };
}

export default function (GanttBodyColumns: { new(GanttBody): GanttBodyColumns },
                         GanttBodyRows: { new(GanttBody): GanttBodyRows },
                         GanttBodyBackground: { new(GanttBody): GanttBodyBackground },
                         GanttBodyForeground: { new(GanttBody): GanttBodyForeground }) {
  'ngInject';

  GanttBody.GanttBodyColumns = GanttBodyColumns;
  GanttBody.GanttBodyRows = GanttBodyRows;
  GanttBody.GanttBodyBackground = GanttBodyBackground;
  GanttBody.GanttBodyForeground = GanttBodyForeground;

  return GanttBody;
}
