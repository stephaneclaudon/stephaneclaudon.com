<template>
  <ul class="projects">
    <li v-for="project in projects" :key="project.id" class="projects--item">
        <a @click="viewProject(project)" href="#">
            <div class="projects--item__bg">
                <img :src="getVideoPoster(project)" :alt="project.title">
            </div>
            <div class="projects--item__title">
                <h1>{{ project.title }}</h1>
            </div>
        </a>
    </li>
  </ul>
</template>

<script lang="ts">
    import { State, Mutation } from 'vuex-class'
    import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
    import * as MutationTypes from '../store/mutation-types'
  
    @Component
    export default class ProjectsSlider extends Vue {
        @State('projects') projects: Array<Object>
        
        @Mutation(MutationTypes.SET_CURRENT_PROJECT)
        setCurrentProject: (project: Object) => void

        viewProject ( project: any) : void {
            this.setCurrentProject ( project )
            console.log('View project ' + project.title)
        }

        getVideoPoster(project: any) : String{ 
        let posterUrl : String = ''
        switch(project.videoplateform) { 
            case "facebook": { 
                posterUrl =  "https://scontent-cdg2-1.xx.fbcdn.net/v/t15.0-10/p720x720/24594542_10155038687253204_6434570426336149504_n.jpg?oh=b451a3b459ddc1bb108b461318452c62&oe=5B3F841D"
                break; 
            } 
            case "vimeo": { 
                posterUrl = 'https://i.vimeocdn.com/video/' + project.videoid + '.webp?mw=1300&mh=542'
                break; 
            } 
            case "youtube": {
                posterUrl = 'https://i.ytimg.com/vi/' + project.videoid + '/maxresdefault.jpg'
                break;    
            }  
            default: { 
                console.log("Invalid choice"); 
                break;              
            } 
        }
        
        return posterUrl
        }

        mounted () {
            console.log()
            
        }
    }
</script>
