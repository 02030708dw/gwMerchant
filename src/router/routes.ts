export const adminRoutes = [
    {
        menuUrl: "/n_merchant",
        menuName: "商户管理",
        tip: "dot",
        icon: "PostcardIcon",
        parentPath: '',
        children: [
            {
                parentPath: '/n_merchant',
                menuUrl: "/n_merchant/listmerC",
                menuName: "商户列表",
                cacheable: true,
            },
        ]
    },
    {
        menuUrl: "/n_chart",
        menuName: "报表管理",
        tip: "dot",
        icon: "PostcardIcon",
        parentPath: '',
        children: [
            {
                parentPath: '/n_chart',
                menuUrl: "/n_chart/listmerorder",
                menuName: "会员订单列表",
                cacheable: true,
            },
            {
                parentPath: '/n_chart',
                menuUrl: "/n_chart/listmembreakeven",
                menuName: "会员盈亏列表",
                cacheable: true,
            },
            {
                parentPath: '/n_chart',
                menuUrl: "/n_chart/listmerbreakeven",
                menuName: "商户盈亏列表",
                cacheable: true,
            },
        ]
    },
    {
        menuUrl: "/n_game",
        menuName: "游戏管理",
        tip: "dot",
        icon: "PostcardIcon",
        parentPath: '',
        children: [
            {
                parentPath: '/n_game',
                menuUrl: "/n_game/listg",
                menuName: "游戏列表",
                cacheable: true,
            },
            {
                parentPath: '/n_game',
                menuUrl: "/n_game/listgp",
                menuName: "游戏玩法列表",
                cacheable: true,
            },
        ]
    },
];