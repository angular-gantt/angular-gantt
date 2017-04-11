export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttRowTreeLabel');
  builder.restrict = 'A';
  builder.templateUrl = undefined;
  return builder.build();
};
