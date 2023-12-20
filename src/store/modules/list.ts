import {defineStore} from "pinia";
import {post} from "@/api/http";
import {getGameList} from "@/api/url";
const useListStore = defineStore("list", {
    state: () => {
        return {
            gameList:[]
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
        }
    },
});

export default useListStore;