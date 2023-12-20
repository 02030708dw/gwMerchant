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