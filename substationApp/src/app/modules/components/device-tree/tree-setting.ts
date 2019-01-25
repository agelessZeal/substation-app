import {NodeMenuItemAction} from 'ng2-tree';

export const MyTreeSetting = {
  settings: {
    rootIsVisible: false,
    'static': true,
    'rightMenu': false,
    'leftMenu': false,
    'cssClasses': {
      'expanded': 'fa fa-minus-square-o fa-lg',
      'collapsed': 'fa fa-plus-square-o fa-lg',
      'leaf': 'fa fa-lg',
      'empty': 'fa fa-caret-right disabled'
    },
    'templates': {
      'node': '<i class="fa fa-building-o fa-lg"></i>',
      'leaf': '<i class="fa fa-angle-right fa-lg"></i>',
      'leftMenu': '<i class="fa fa-navicon fa-lg"></i>'
    },
    'menuItems': [
      {action: NodeMenuItemAction.Custom, name: 'Foo', cssClass: 'fa fa-arrow-right'},
      {action: NodeMenuItemAction.Custom, name: 'Bar', cssClass: 'fa fa-arrow-right'},
      {action: NodeMenuItemAction.Custom, name: 'Baz', cssClass: 'fa fa-arrow-right'}
    ]
  }
};
