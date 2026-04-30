export class Menu {
    constructor(public id: string,
                public title: string,
                public routerLink: string,
                public href: string,
                public icon: string,
                public target: string,
                public hasSubMenu: boolean,
                public parentId: string) { }
} 