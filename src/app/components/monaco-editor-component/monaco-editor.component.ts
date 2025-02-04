import { ScriptTarget, ModuleKind, ModuleResolutionKind } from 'typescript';
import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import { SharkJSContext } from "../../../framework/ui/component-resolver";
import html from './monaco-editor.component.html';
import './monaco-editor.component.scss';

import * as monaco from 'monaco-editor';

@Component({
    name: 'MonacoEditorComponent',
    html: html
})
export class MonacoEditorComponent {
    root!: HTMLElement;
    dataContext: any = {};
    editorHTML: any;
    editorTS: any;
    renderContainer: any;

    constructor(private changeDetector: ChangeDetector) {
        setTimeout(() => { 
            this.root = document.querySelector('.monaco-editor-root') as HTMLElement;
            this.editorHTML = monaco.editor.create(this.root.querySelector('.editor-html') as HTMLElement, {
                value: ['<div>', '  <div bind-component="SimpleBindingSampleComponent">', '  </div>', '</div>'].join('\n'),
                language: 'html',
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto'
                },
                theme: "vs-dark"
            });
            
            // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            //     target: ScriptTarget.ESNext,
            //     module: ModuleKind['NodeNext'],
            //     moduleResolution: ModuleResolutionKind.nodenext
            // });

            // this.editorTS = monaco.editor.create(this.root.querySelector('.editor-ts') as HTMLElement, {
            //     value: [''].join('\n'),
            //     language: 'typescript',
            //     scrollbar: {
            //         vertical: 'auto',
            //         horizontal: 'auto'
            //     },
            //     theme: "vs-dark"
            // });

            this.renderContainer = document.querySelector('.render-container') as HTMLElement;
         });
    }

    onCompile(e: SharkJSContext) {        
        this.renderContainer.innerHTML = this.editorHTML.getValue();
        this.changeDetector.updateView(this);
    }
}