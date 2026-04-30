import { Component, Directive, ElementRef, EventEmitter, HostListener, Inject, Input, NgModule, Optional, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { enabled, exit, request } from 'screenfull';

class CustomEvent {
    /**
     * @param {?} name
     * @param {?} imageIndex
     */
    constructor(name, imageIndex) {
        this.name = name;
        this.imageIndex = imageIndex;
    }
}

const DEFAULT_CONFIG = {
    btnClass: 'default',
    zoomFactor: 0.1,
    containerBackgroundColor: '#ccc',
    wheelZoom: false,
    allowFullscreen: true,
    allowKeyboardNavigation: true,
    btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
    },
    btnIcons: {
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa fa-repeat',
        rotateCounterClockwise: 'fa fa-undo',
        next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa fa-arrows-alt',
    }
};
class ImageViewerComponent {
    /**
     * @param {?} moduleConfig
     */
    constructor(moduleConfig) {
        this.moduleConfig = moduleConfig;
        this.index = 0;
        this.indexChange = new EventEmitter();
        this.configChange = new EventEmitter();
        this.customEvent = new EventEmitter();
        this.style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
        this.fullscreen = false;
        this.loading = true;
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.hovered = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
        this.config = this.mergeConfig(merged, this.config);
        this.triggerConfigBinding();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    nextImage(event) {
        if (this.canNavigate(event) && this.index < this.src.length - 1) {
            this.loading = true;
            this.index++;
            this.triggerIndexBinding();
            this.reset();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    prevImage(event) {
        if (this.canNavigate(event) && this.index > 0) {
            this.loading = true;
            this.index--;
            this.triggerIndexBinding();
            this.reset();
        }
    }
    /**
     * @return {?}
     */
    zoomIn() {
        this.scale *= (1 + this.config.zoomFactor);
        this.updateStyle();
    }
    /**
     * @return {?}
     */
    zoomOut() {
        if (this.scale > this.config.zoomFactor) {
            this.scale /= (1 + this.config.zoomFactor);
        }
        this.updateStyle();
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    scrollZoom(evt) {
        if (this.config.wheelZoom) {
            evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
            return false;
        }
    }
    /**
     * @return {?}
     */
    rotateClockwise() {
        this.rotation += 90;
        this.updateStyle();
    }
    /**
     * @return {?}
     */
    rotateCounterClockwise() {
        this.rotation -= 90;
        this.updateStyle();
    }
    /**
     * @return {?}
     */
    onLoad() {
        this.loading = false;
    }
    /**
     * @return {?}
     */
    onLoadStart() {
        this.loading = true;
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    onDragOver(evt) {
        this.translateX += (evt.clientX - this.prevX);
        this.translateY += (evt.clientY - this.prevY);
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
        this.updateStyle();
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    onDragStart(evt) {
        if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
            evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
        }
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
    }
    /**
     * @return {?}
     */
    toggleFullscreen() {
        this.fullscreen = !this.fullscreen;
        if (!this.fullscreen) {
            this.reset();
        }
    }
    /**
     * @return {?}
     */
    triggerIndexBinding() {
        this.indexChange.emit(this.index);
    }
    /**
     * @return {?}
     */
    triggerConfigBinding() {
        this.configChange.next(this.config);
    }
    /**
     * @param {?} name
     * @param {?} imageIndex
     * @return {?}
     */
    fireCustomEvent(name, imageIndex) {
        this.customEvent.emit(new CustomEvent(name, imageIndex));
    }
    /**
     * @return {?}
     */
    reset() {
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.updateStyle();
    }
    /**
     * @return {?}
     */
    onMouseOver() {
        this.hovered = true;
    }
    /**
     * @return {?}
     */
    onMouseLeave() {
        this.hovered = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    canNavigate(event) {
        return event == null || (this.config.allowKeyboardNavigation && this.hovered);
    }
    /**
     * @return {?}
     */
    updateStyle() {
        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
        this.style.msTransform = this.style.transform;
        this.style.webkitTransform = this.style.transform;
        this.style.oTransform = this.style.transform;
    }
    /**
     * @param {?} defaultValues
     * @param {?} overrideValues
     * @return {?}
     */
    mergeConfig(defaultValues, overrideValues) {
        let /** @type {?} */ result = Object.assign({}, defaultValues);
        if (overrideValues) {
            result = Object.assign({}, defaultValues, overrideValues);
            if (overrideValues.btnIcons) {
                result.btnIcons = Object.assign({}, defaultValues.btnIcons, overrideValues.btnIcons);
            }
        }
        return result;
    }
}
ImageViewerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-image-viewer',
                template: `
    <div [ngxToggleFullscreen]="fullscreen" class="img-container" [style.backgroundColor]="config.containerBackgroundColor"
         (wheel)="scrollZoom($event)" (dragover)="onDragOver($event)">
      <img [src]="src[index]" [ngStyle]="style" alt="Image not found..." (dragstart)="onDragStart($event)" (load)="onLoad()" (loadstart)="onLoadStart()"/>
      <!-- Div below will be used to hide the 'ghost' image when dragging -->
      <div></div>
      <div class="spinner-container" *ngIf="loading">
        <div class="spinner"></div>
      </div>

      <button type="button" [class]="config.btnClass" *ngIf="config.btnShow.rotateCounterClockwise" (click)="rotateCounterClockwise()">
        <span [class]="config.btnIcons.rotateCounterClockwise"></span>
      </button>
      <button type="button" [class]="config.btnClass" *ngIf="config.btnShow.rotateClockwise" (click)="rotateClockwise()">
        <span [class]="config.btnIcons.rotateClockwise"></span>
      </button>

      <button type="button" [class]="config.btnClass" *ngIf="config.btnShow.zoomOut" (click)="zoomOut()">
        <span [class]="config.btnIcons.zoomOut"></span>
      </button>
      <button type="button" [class]="config.btnClass" *ngIf="config.btnShow.zoomIn" (click)="zoomIn()">
        <span [class]="config.btnIcons.zoomIn"></span>
      </button>

      <button type="button" [class]="config.btnClass" *ngFor="let cBtn of config.customBtns" (click)="fireCustomEvent(cBtn.name, index)">
        <span [class]="cBtn.icon"></span>
      </button>

      <button type="button" id="ngx-fs-btn" [class]="config.btnClass" (click)="toggleFullscreen()" *ngIf="config.allowFullscreen">
        <span [class]="config.btnIcons.fullscreen"></span>
      </button>

      <div class="nav-button-container" *ngIf="src.length > 1">
        <button type="button" [class]="config.btnClass" (click)="prevImage()" [disabled]="index === 0">
          <span [class]="config.btnIcons.prev"></span>
        </button>
        <button type="button" [class]="config.btnClass" (click)="nextImage()" [disabled]="index === src.length - 1">
          <span [class]="config.btnIcons.next"></span>
        </button>
      </div>
    </div>
  `,
                styles: [`
    .img-container {
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative; }

    .img-container img {
      z-index: 2;
      margin: 0 auto;
      display: block;
      max-width: 100%;
      max-height: 100%; }

    .img-container button {
      z-index: 99;
      position: absolute;
      right: 15px; }
      .img-container button:not(:disabled) {
        cursor: pointer; }

    .img-container > button:nth-of-type(1):not(#ngx-fs-btn) {
      bottom: 15px; }

    .img-container > button:nth-of-type(2):not(#ngx-fs-btn) {
      bottom: 65px; }

    .img-container > button:nth-of-type(3):not(#ngx-fs-btn) {
      bottom: 115px; }

    .img-container > button:nth-of-type(4):not(#ngx-fs-btn) {
      bottom: 165px; }

    .img-container > button:nth-of-type(5):not(#ngx-fs-btn) {
      bottom: 215px; }

    .img-container > button:nth-of-type(6):not(#ngx-fs-btn) {
      bottom: 265px; }

    .img-container > button:nth-of-type(7):not(#ngx-fs-btn) {
      bottom: 315px; }

    #ngx-fs-btn {
      top: 15px; }

    button.default {
      height: 40px;
      width: 40px;
      border: 1px solid #555;
      border-radius: 50%;
      background-color: white;
      opacity: 0.7;
      -webkit-transition: opacity 200ms;
      transition: opacity 200ms; }

    button.default:hover {
      opacity: 1; }

    button.default:disabled {
      opacity: 0.25; }

    .nav-button-container > button {
      position: relative;
      right: 0;
      margin: 0 10px; }

    .nav-button-container {
      text-align: center;
      position: absolute;
      z-index: 98;
      bottom: 10px;
      left: 0;
      right: 0; }

    .spinner-container {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 60px;
      height: 60px;
      margin: auto;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 25%; }

    .spinner {
      border-width: 7px;
      border-style: solid;
      border-color: #ccc;
      border-bottom-color: #222;
      border-radius: 50%;
      height: 100%;
      width: 100%;
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      -webkit-animation: rotation 2s linear infinite;
      /* Safari 4+ */
      /* Fx 5+ */
      /* Opera 12+ */
      animation: rotation 2s linear infinite;
      /* IE 10+, Fx 29+ */ }

    @keyframes rotation {
      from {
        -webkit-transform: rotate(0deg); }
      to {
        -webkit-transform: rotate(359deg); } }

    @-webkit-keyframes rotation {
      from {
        -webkit-transform: rotate(0deg); }
      to {
        -webkit-transform: rotate(359deg); } }
  `]
            },] },
];
/**
 * @nocollapse
 */
ImageViewerComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['config',] },] },
];
ImageViewerComponent.propDecorators = {
    'src': [{ type: Input },],
    'index': [{ type: Input },],
    'config': [{ type: Input },],
    'indexChange': [{ type: Output },],
    'configChange': [{ type: Output },],
    'customEvent': [{ type: Output },],
    'nextImage': [{ type: HostListener, args: ['window:keyup.ArrowRight', ['$event'],] },],
    'prevImage': [{ type: HostListener, args: ['window:keyup.ArrowLeft', ['$event'],] },],
    'onMouseOver': [{ type: HostListener, args: ['mouseover',] },],
    'onMouseLeave': [{ type: HostListener, args: ['mouseleave',] },],
};

class ToggleFullscreenDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.isFullscreen && enabled) {
            request(this.el.nativeElement);
        }
        else if (enabled) {
            exit();
        }
    }
}
ToggleFullscreenDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxToggleFullscreen]'
            },] },
];
/**
 * @nocollapse
 */
ToggleFullscreenDirective.ctorParameters = () => [
    { type: ElementRef, },
];
ToggleFullscreenDirective.propDecorators = {
    'isFullscreen': [{ type: Input, args: ['ngxToggleFullscreen',] },],
};

class ImageViewerModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: ImageViewerModule,
            providers: [{ provide: 'config', useValue: config }]
        };
    }
}
ImageViewerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    ImageViewerComponent,
                    ToggleFullscreenDirective
                ],
                exports: [
                    ImageViewerComponent,
                    ToggleFullscreenDirective
                ]
            },] },
];
/**
 * @nocollapse
 */
ImageViewerModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { ImageViewerComponent, CustomEvent, ImageViewerModule, ToggleFullscreenDirective as ɵa };
//# sourceMappingURL=ngx-image-viewer.js.map
