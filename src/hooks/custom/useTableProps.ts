import {reactive, ref} from "vue";

export default function (props:Record<'title'|'prop', string>[]) {
    const tableProps = ref(props.map(it=>({
        title:it.title,
        prop:it.prop,
        checked:true
    })));
    return {
        tableProps
    }
}