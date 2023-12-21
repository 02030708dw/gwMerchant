import {defineStore} from "pinia";
import {get, post} from "@/api/http";
import {getGameList, getMemberSelectList} from "@/api/url";
const useListStore = defineStore("list", {
    persist:true,
    state: () => {
        return {
            gameList:[] as Record<'gameName'|'gameId', string>[],
            memberList:[]
        };
    },
    getters: {

    },
    actions: {
        async addGameList(data:any={status:1}){
           const r=await post({
               url:getGameList,
               data
           })
            this.gameList=r.resultSet
        },
        async addMemberList(data:any={status:1}){
            const r=await get({
                url:getMemberSelectList,
                data
            })
            this.memberList=r.resultSet
        }
    },
});

export default useListStore;