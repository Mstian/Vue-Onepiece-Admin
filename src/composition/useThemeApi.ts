import {reactive} from 'vue';
import themeVariables from '@/style/theme.less';
const theme = reactive({customTheme:themeVariables.customTheme});
export function useTheme() {
    function setTheme(color: string){
        theme.customTheme = color;
    }
    return {
        theme,
        setTheme
    };
}