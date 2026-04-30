import { Component, Directive, ElementRef, EventEmitter, HostListener, Inject, Input, NgModule, Optional, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { enabled, exit, request } from 'screenfull';
var CustomEvent = (function () {
    /**
     * @param {?} name
     * @param {?} imageIndex
     */
    function CustomEvent(name, imageIndex) {
        this.name = name;
        this.imageIndex = imageIndex;
    }
    return CustomEvent;
}());
var DEFAULT_CONFIG = {
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
var ImageViewerComponent = (function () {
    /**
     * @param {?} moduleConfig
     */
    function ImageViewerComponent(moduleConfig) {
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
    ImageViewerComponent.prototype.ngOnInit = function () {
        var /** @type {?} */ merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
        this.config = this.mergeConfig(merged, this.config);
        this.triggerConfigBinding();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ImageViewerComponent.prototype.nextImage = function (event) {
        if (this.canNavigate(event) && this.index < this.src.length - 1) {
            this.loading = true;
            this.index++;
            this.triggerIndexBinding();
            this.reset();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ImageViewerComponent.prototype.prevImage = function (event) {
        if (this.canNavigate(event) && this.index > 0) {
            this.loading = true;
            this.index--;
            this.triggerIndexBinding();
            this.reset();
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.zoomIn = function () {
        this.scale *= (1 + this.config.zoomFactor);
        this.updateStyle();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.zoomOut = function () {
        if (this.scale > this.config.zoomFactor) {
            this.scale /= (1 + this.config.zoomFactor);
        }
        this.updateStyle();
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    ImageViewerComponent.prototype.scrollZoom = function (evt) {
        if (this.config.wheelZoom) {
            evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
            return false;
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.rotateClockwise = function () {
        this.rotation += 90;
        this.updateStyle();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.rotateCounterClockwise = function () {
        this.rotation -= 90;
        this.updateStyle();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.onLoad = function () {
        this.loading = false;
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.onLoadStart = function () {
        this.loading = true;
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    ImageViewerComponent.prototype.onDragOver = function (evt) {
        this.translateX += (evt.clientX - this.prevX);
        this.translateY += (evt.clientY - this.prevY);
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
        this.updateStyle();
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    ImageViewerComponent.prototype.onDragStart = function (evt) {
        if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
            evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
        }
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.toggleFullscreen = function () {
        this.fullscreen = !this.fullscreen;
        if (!this.fullscreen) {
            this.reset();
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.triggerIndexBinding = function () {
        this.indexChange.emit(this.index);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.triggerConfigBinding = function () {
        this.configChange.next(this.config);
    };
    /**
     * @param {?} name
     * @param {?} imageIndex
     * @return {?}
     */
    ImageViewerComponent.prototype.fireCustomEvent = function (name, imageIndex) {
        this.customEvent.emit(new CustomEvent(name, imageIndex));
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.reset = function () {
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.updateStyle();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.onMouseOver = function () {
        this.hovered = true;
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.onMouseLeave = function () {
        this.hovered = false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ImageViewerComponent.prototype.canNavigate = function (event) {
        return event == null || (this.config.allowKeyboardNavigation && this.hovered);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.updateStyle = function () {
        this.style.transform = "translate(" + this.translateX + "px, " + this.translateY + "px) rotate(" + this.rotation + "deg) scale(" + this.scale + ")";
        this.style.msTransform = this.style.transform;
        this.style.webkitTransform = this.style.transform;
        this.style.oTransform = this.style.transform;
    };
    /**
     * @param {?} defaultValues
     * @param {?} overrideValues
     * @return {?}
     */
    ImageViewerComponent.prototype.mergeConfig = function (defaultValues, overrideValues) {
        var /** @type {?} */ result = Object.assign({}, defaultValues);
        if (overrideValues) {
            result = Object.assign({}, defaultValues, overrideValues);
            if (overrideValues.btnIcons) {
                result.btnIcons = Object.assign({}, defaultValues.btnIcons, overrideValues.btnIcons);
            }
        }
        return result;
    };
    return ImageViewerComponent;
}());
ImageViewerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-image-viewer',
                template: "\n    <div [ngxToggleFullscreen]=\"fullscreen\" class=\"img-container\" [style.backgroundColor]=\"config.containerBackgroundColor\"\n         (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\n      <img [src]=\"src[index]\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\n      <!-- Div below will be used to hide the 'ghost' image when dragging -->\n      <div></div>\n      <div class=\"spinner-container\" *ngIf=\"loading\">\n        <div class=\"spinner\"></div>\n      </div>\n\n      <button type=\"button\" [class]=\"config.btnClass\" *ngIf=\"config.btnShow.rotateCounterClockwise\" (click)=\"rotateCounterClockwise()\">\n        <span [class]=\"config.btnIcons.rotateCounterClockwise\"></span>\n      </button>\n      <button type=\"button\" [class]=\"config.btnClass\" *ngIf=\"config.btnShow.rotateClockwise\" (click)=\"rotateClockwise()\">\n        <span [class]=\"config.btnIcons.rotateClockwise\"></span>\n      </button>\n\n      <button type=\"button\" [class]=\"config.btnClass\" *ngIf=\"config.btnShow.zoomOut\" (click)=\"zoomOut()\">\n        <span [class]=\"config.btnIcons.zoomOut\"></span>\n      </button>\n      <button type=\"button\" [class]=\"config.btnClass\" *ngIf=\"config.btnShow.zoomIn\" (click)=\"zoomIn()\">\n        <span [class]=\"config.btnIcons.zoomIn\"></span>\n      </button>\n\n      <button type=\"button\" [class]=\"config.btnClass\" *ngFor=\"let cBtn of config.customBtns\" (click)=\"fireCustomEvent(cBtn.name, index)\">\n        <span [class]=\"cBtn.icon\"></span>\n      </button>\n\n      <button type=\"button\" id=\"ngx-fs-btn\" [class]=\"config.btnClass\" (click)=\"toggleFullscreen()\" *ngIf=\"config.allowFullscreen\">\n        <span [class]=\"config.btnIcons.fullscreen\"></span>\n      </button>\n\n      <div class=\"nav-button-container\" *ngIf=\"src.length > 1\">\n        <button type=\"button\" [class]=\"config.btnClass\" (click)=\"prevImage()\" [disabled]=\"index === 0\">\n          <span [class]=\"config.btnIcons.prev\"></span>\n        </button>\n        <button type=\"button\" [class]=\"config.btnClass\" (click)=\"nextImage()\" [disabled]=\"index === src.length - 1\">\n          <span [class]=\"config.btnIcons.next\"></span>\n        </button>\n      </div>\n    </div>\n  ",
                styles: ["\n    .img-container {\n      height: 100%;\n      width: 100%;\n      overflow: hidden;\n      position: relative; }\n\n    .img-container img {\n      z-index: 2;\n      margin: 0 auto;\n      display: block;\n      max-width: 100%;\n      max-height: 100%; }\n\n    .img-container button {\n      z-index: 99;\n      position: absolute;\n      right: 15px; }\n      .img-container button:not(:disabled) {\n        cursor: pointer; }\n\n    .img-container > button:nth-of-type(1):not(#ngx-fs-btn) {\n      bottom: 15px; }\n\n    .img-container > button:nth-of-type(2):not(#ngx-fs-btn) {\n      bottom: 65px; }\n\n    .img-container > button:nth-of-type(3):not(#ngx-fs-btn) {\n      bottom: 115px; }\n\n    .img-container > button:nth-of-type(4):not(#ngx-fs-btn) {\n      bottom: 165px; }\n\n    .img-container > button:nth-of-type(5):not(#ngx-fs-btn) {\n      bottom: 215px; }\n\n    .img-container > button:nth-of-type(6):not(#ngx-fs-btn) {\n      bottom: 265px; }\n\n    .img-container > button:nth-of-type(7):not(#ngx-fs-btn) {\n      bottom: 315px; }\n\n    #ngx-fs-btn {\n      top: 15px; }\n\n    button.default {\n      height: 40px;\n      width: 40px;\n      border: 1px solid #555;\n      border-radius: 50%;\n      background-color: white;\n      opacity: 0.7;\n      -webkit-transition: opacity 200ms;\n      transition: opacity 200ms; }\n\n    button.default:hover {\n      opacity: 1; }\n\n    button.default:disabled {\n      opacity: 0.25; }\n\n    .nav-button-container > button {\n      position: relative;\n      right: 0;\n      margin: 0 10px; }\n\n    .nav-button-container {\n      text-align: center;\n      position: absolute;\n      z-index: 98;\n      bottom: 10px;\n      left: 0;\n      right: 0; }\n\n    .spinner-container {\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 0;\n      bottom: 0;\n      width: 60px;\n      height: 60px;\n      margin: auto;\n      padding: 10px;\n      background-color: rgba(0, 0, 0, 0.4);\n      border-radius: 25%; }\n\n    .spinner {\n      border-width: 7px;\n      border-style: solid;\n      border-color: #ccc;\n      border-bottom-color: #222;\n      border-radius: 50%;\n      height: 100%;\n      width: 100%;\n      -webkit-box-sizing: border-box;\n              box-sizing: border-box;\n      -webkit-animation: rotation 2s linear infinite;\n      /* Safari 4+ */\n      /* Fx 5+ */\n      /* Opera 12+ */\n      animation: rotation 2s linear infinite;\n      /* IE 10+, Fx 29+ */ }\n\n    @keyframes rotation {\n      from {\n        -webkit-transform: rotate(0deg); }\n      to {\n        -webkit-transform: rotate(359deg); } }\n\n    @-webkit-keyframes rotation {\n      from {\n        -webkit-transform: rotate(0deg); }\n      to {\n        -webkit-transform: rotate(359deg); } }\n  "]
            },] },
];
/**
 * @nocollapse
 */
ImageViewerComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['config',] },] },
]; };
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
var ToggleFullscreenDirective = (function () {
    /**
     * @param {?} el
     */
    function ToggleFullscreenDirective(el) {
        this.el = el;
    }
    /**
     * @return {?}
     */
    ToggleFullscreenDirective.prototype.ngOnChanges = function () {
        if (this.isFullscreen && enabled) {
            request(this.el.nativeElement);
        }
        else if (enabled) {
            exit();
        }
    };
    return ToggleFullscreenDirective;
}());
ToggleFullscreenDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxToggleFullscreen]'
            },] },
];
/**
 * @nocollapse
 */
ToggleFullscreenDirective.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
ToggleFullscreenDirective.propDecorators = {
    'isFullscreen': [{ type: Input, args: ['ngxToggleFullscreen',] },],
};
var ImageViewerModule = (function () {
    function ImageViewerModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    ImageViewerModule.forRoot = function (config) {
        return {
            ngModule: ImageViewerModule,
            providers: [{ provide: 'config', useValue: config }]
        };
    };
    return ImageViewerModule;
}());
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
ImageViewerModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { ImageViewerComponent, CustomEvent, ImageViewerModule, ToggleFullscreenDirective as ɵa };
//# sourceMappingURL=ngx-image-viewer.es5.js.map
