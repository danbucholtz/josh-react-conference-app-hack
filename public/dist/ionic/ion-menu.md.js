/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */

Ionic.loadStyles("ion-menu_md","ion-menu {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  display: none;\n  contain: strict;\n}\n\nion-menu.show-menu {\n  display: block;\n}\n\n.menu-inner {\n  left: 0;\n  right: auto;\n  top: 0;\n  bottom: 0;\n  transform: translate3d(-9999px,  0,  0);\n  position: absolute;\n  display: block;\n  width: 304px;\n  height: 100%;\n  contain: strict;\n}\n\n.menu-side-left > .menu-inner {\n  right: auto;\n  left: 0;\n}\n\n.menu-side-right > .menu-inner {\n  right: 0;\n  left: auto;\n}\n\nion-menu ion-backdrop {\n  z-index: -1;\n  display: none;\n  opacity: .01;\n}\n\n.menu-content {\n  transform: translate3d(0,  0,  0);\n}\n\n.menu-content-open {\n  cursor: pointer;\n  touch-action: manipulation;\n}\n\n.menu-content-open ion-pane,\n.menu-content-open .ion-pane,\n.menu-content-open ion-content,\n.menu-content-open .toolbar {\n  pointer-events: none;\n}\n\n\@media (max-width: 340px) {\n  .menu-inner {\n    width: 264px;\n  }\n}\n\nion-menu.menu-type-reveal {\n  z-index: 0;\n}\n\nion-menu.menu-type-reveal.show-menu .menu-inner {\n  transform: translate3d(0,  0,  0);\n}\n\nion-menu.menu-type-overlay {\n  z-index: 80;\n}\n\nion-menu.menu-type-overlay .show-backdrop {\n  display: block;\n  cursor: pointer;\n}\n\n.menu-md .menu-inner {\n  background: #fff;\n}\n\n.menu-md.menu-type-overlay .menu-inner {\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);\n}\n\n.app-md .menu-content-reveal {\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);\n}\n\n.app-md .menu-content-push {\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);\n}\nion-menu.hydrated{visibility:inherit}","ion-menu-controller_md","\nion-menu-controller.hydrated{visibility:inherit}");
Ionic.loadComponents(

/**** module id (dev mode) ****/
"ion-menu.md",

/**** component modules ****/
function importComponent(exports, h, Context, publicPath) {
"use strict";
// @stencil/core

/** @hidden */

function assert(bool, msg) {
    if (!bool) {
        console.error(msg);
    }
}









function checkEdgeSide(posX, isRightSide, maxEdgeStart) {
    if (isRightSide) {
        return posX >= window.innerWidth - maxEdgeStart;
    }
    else {
        return posX <= maxEdgeStart;
    }
}
/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */
function isRightSide(side, defaultRight = false) {
    const isRTL = document.dir === 'rtl';
    switch (side) {
        case 'right': return true;
        case 'left': return false;
        case 'end': return !isRTL;
        case 'start': return isRTL;
        default: return defaultRight ? !isRTL : isRTL;
    }
}
/** @hidden */



/** @hidden */








/**
 * @private
 */

class Menu {
    constructor() {
        this.isPane = false;
        this._isOpen = false;
        this.lastOnEnd = 0;
        this.isAnimating = false;
        this.isRightSide = false;
        this.width = null;
        /**
         * @input {string} The display type of the menu. Default varies based on the mode,
         * see the `menuType` in the [config](../../config/Config). Available options:
         * `"overlay"`, `"reveal"`, `"push"`.
         */
        this.type = 'overlay';
        /**
         * @input {string} Which side of the view the menu should be placed. Default `"start"`.
         */
        this.side = 'start';
        /**
         * @input {boolean} If true, swiping the menu is enabled. Default `true`.
         */
        this.swipeEnabled = true;
        /**
         * @input {boolean} If true, the menu will persist on child pages.
         */
        this.persistent = false;
        /**
         * @hidden
         */
        this.maxEdgeStart = 50;
    }
    typeChanged(type) {
        if (this.contentEl) {
            this.contentEl.classList.remove('menu-content-' + this.type);
            this.contentEl.classList.add('menu-content-' + type);
            this.contentEl.removeAttribute('style');
        }
        if (this.menuInnerEl) {
            // Remove effects of previous animations
            this.menuInnerEl.removeAttribute('style');
        }
        this.animation = null;
    }
    enabledChanged() {
        this.updateState();
    }
    sideChanged() {
        this.isRightSide = isRightSide(this.side);
    }
    swipeEnabledChanged() {
        this.updateState();
    }
    componentWillLoad() {
        return this.lazyMenuCtrl.componentOnReady().then(menu => {
            this.menuCtrl = menu;
        });
    }
    componentDidLoad() {
        assert(!!this.menuCtrl, 'menucontroller was not initialized');
        const el = this.el;
        const contentQuery = (this.content)
            ? '#' + this.content
            : '[main]';
        const parent = el.parentElement;
        const content = this.contentEl = parent.querySelector(contentQuery);
        if (!content || !content.tagName) {
            // requires content element
            return console.error('Menu: must have a "content" element to listen for drag events on.');
        }
        this.menuInnerEl = el.querySelector('.menu-inner');
        this.backdropEl = el.querySelector('.menu-backdrop');
        // add menu's content classes
        content.classList.add('menu-content');
        this.typeChanged(this.type);
        this.sideChanged();
        let isEnabled = this.enabled;
        if (isEnabled === true || typeof isEnabled === 'undefined') {
            const menus = this.menuCtrl.getMenus();
            isEnabled = !menus.some(m => {
                return m.side === this.side && m.enabled;
            });
        }
        // register this menu with the app's menu controller
        this.menuCtrl._register(this);
        // mask it as enabled / disabled
        this.enabled = isEnabled;
    }
    componentDidUnload() {
        this.menuCtrl._unregister(this);
        this.animation && this.animation.destroy();
        this.menuCtrl = this.animation = null;
        this.contentEl = this.backdropEl = this.menuInnerEl = null;
    }
    splitPaneChanged(ev) {
        this.isPane = ev.detail.splitPane.isPane(this.el);
        this.updateState();
    }
    onBackdropClick(ev) {
        const el = ev.target;
        if (!el.closest('.menu-inner') && this.lastOnEnd < (ev.timeStamp - 100)) {
            ev.preventDefault();
            ev.stopPropagation();
            this.close();
        }
    }
    getElement() {
        return this.el;
    }
    isOpen() {
        return this._isOpen;
    }
    setOpen(shouldOpen, animated = true) {
        // If the menu is disabled or it is currenly being animated, let's do nothing
        if (!this.isActive() || this.isAnimating || (shouldOpen === this._isOpen)) {
            return Promise.resolve(this._isOpen);
        }
        this.beforeAnimation();
        return this.loadAnimation()
            .then(() => this.startAnimation(shouldOpen, animated))
            .then(() => this.afterAnimation(shouldOpen));
    }
    open() {
        return this.setOpen(true);
    }
    close() {
        return this.setOpen(false);
    }
    toggle() {
        return this.setOpen(!this._isOpen);
    }
    loadAnimation() {
        // Menu swipe animation takes the menu's inner width as parameter,
        // If `offsetWidth` changes, we need to create a new animation.
        const width = this.menuInnerEl.offsetWidth;
        if (width === this.width && this.animation !== null) {
            return Promise.resolve();
        }
        // Destroy existing animation
        this.animation && this.animation.destroy();
        this.animation = null;
        this.width = width;
        // Create new animation
        return this.menuCtrl.createAnimation(this.type, this).then(ani => {
            this.animation = ani;
        });
    }
    startAnimation(shouldOpen, animated) {
        let done;
        const promise = new Promise(resolve => done = resolve);
        const ani = this.animation
            .onFinish(done, { oneTimeCallback: true, clearExistingCallacks: true })
            .reverse(!shouldOpen);
        if (animated) {
            ani.play();
        }
        else {
            ani.syncPlay();
        }
        return promise;
    }
    isActive() {
        return this.enabled && !this.isPane;
    }
    canSwipe() {
        return this.swipeEnabled &&
            !this.isAnimating &&
            this.isActive();
    }
    canStart(detail) {
        if (!this.canSwipe()) {
            return false;
        }
        if (this._isOpen) {
            return true;
        }
        else if (this.menuCtrl.getOpen()) {
            return false;
        }
        return checkEdgeSide(detail.currentX, this.isRightSide, this.maxEdgeStart);
    }
    onWillStart() {
        this.beforeAnimation();
        return this.loadAnimation();
    }
    onDragStart() {
        assert(!!this.animation, '_type is undefined');
        if (!this.isAnimating) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        // the cloned animation should not use an easing curve during seek
        this.animation
            .reverse(this._isOpen)
            .progressStart();
    }
    onDragMove(detail) {
        assert(!!this.animation, '_type is undefined');
        if (!this.isAnimating) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        const delta = computeDelta(detail.deltaX, this._isOpen, this.isRightSide);
        const stepValue = delta / this.width;
        this.animation.progressStep(stepValue);
    }
    onDragEnd(detail) {
        assert(!!this.animation, '_type is undefined');
        if (!this.isAnimating) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        const isOpen = this._isOpen;
        const isRightSide$$1 = this.isRightSide;
        const delta = computeDelta(detail.deltaX, isOpen, isRightSide$$1);
        const width = this.width;
        const stepValue = delta / width;
        const velocity = detail.velocityX;
        const z = width / 2.0;
        const shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || detail.deltaX > z);
        const shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || detail.deltaX < -z);
        const shouldComplete = (isOpen)
            ? isRightSide$$1 ? shouldCompleteRight : shouldCompleteLeft
            : isRightSide$$1 ? shouldCompleteLeft : shouldCompleteRight;
        let shouldOpen = (!isOpen && shouldComplete);
        if (isOpen && !shouldComplete) {
            shouldOpen = true;
        }
        const missing = shouldComplete ? 1 - stepValue : stepValue;
        const missingDistance = missing * width;
        let realDur = 0;
        if (missingDistance > 5) {
            const dur = missingDistance / Math.abs(velocity);
            realDur = Math.min(dur, 300);
        }
        this.lastOnEnd = detail.timeStamp;
        this.animation
            .onFinish(() => this.afterAnimation(shouldOpen), { clearExistingCallacks: true })
            .progressEnd(shouldComplete, stepValue, realDur);
    }
    beforeAnimation() {
        assert(!this.isAnimating, '_before() should not be called while animating');
        // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations
        this.el.classList.add(SHOW_MENU);
        this.backdropEl.classList.add(SHOW_BACKDROP);
        this.isAnimating = true;
    }
    afterAnimation(isOpen) {
        assert(this.isAnimating, '_before() should be called while animating');
        // TODO: this._app.setEnabled(false, 100);
        // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        // emit opened/closed events
        this._isOpen = isOpen;
        this.isAnimating = false;
        // add/remove backdrop click listeners
        Context.enableListener(this, 'body:click', isOpen);
        if (isOpen) {
            // disable swipe to go back gesture
            this.gestureBlocker = GESTURE_BLOCKER;
            // add css class
            this.contentEl.classList.add(MENU_CONTENT_OPEN);
            // emit open event
            this.ionOpen.emit({ menu: this });
        }
        else {
            // enable swipe to go back gesture
            this.gestureBlocker = null;
            // remove css classes
            this.el.classList.remove(SHOW_MENU);
            this.contentEl.classList.remove(MENU_CONTENT_OPEN);
            this.backdropEl.classList.remove(SHOW_BACKDROP);
            // emit close event
            this.ionClose.emit({ menu: this });
        }
        return isOpen;
    }
    updateState() {
        const isActive = this.isActive();
        // Close menu inmediately
        if (!isActive && this._isOpen) {
            // close if this menu is open, and should not be enabled
            this.forceClosing();
        }
        if (this.enabled && this.menuCtrl) {
            this.menuCtrl._setActiveMenu(this);
        }
        assert(!this.isAnimating, 'can not be animating');
    }
    forceClosing() {
        assert(this._isOpen, 'menu cannot be closed');
        this.isAnimating = true;
        this.startAnimation(false, false);
        this.afterAnimation(false);
    }
    hostData() {
        const typeClass = 'menu-type-' + this.type;
        return {
            role: 'complementary',
            class: {
                'menu-enabled': this.enabled,
                'menu-side-right': this.isRightSide,
                'menu-side-left': !this.isRightSide,
                [typeClass]: true,
            }
        };
    }
    render() {
        return ([
            h("div", { class: 'menu-inner page-inner' },
                h("slot", null)),
            h("ion-backdrop", { class: 'menu-backdrop' }),
            h("ion-gesture", Object.assign({}, {
                'canStart': this.canStart.bind(this),
                'onWillStart': this.onWillStart.bind(this),
                'onStart': this.onDragStart.bind(this),
                'onMove': this.onDragMove.bind(this),
                'onEnd': this.onDragEnd.bind(this),
                'maxEdgeStart': this.maxEdgeStart,
                'edge': this.side,
                'enabled': this.isActive() && this.swipeEnabled,
                'gestureName': 'menu-swipe',
                'gesturePriority': 10,
                'type': 'pan',
                'direction': 'x',
                'threshold': 10,
                'attachTo': 'body',
                'disableScroll': true,
                'block': this.gestureBlocker
            }))
        ]);
    }
}
function computeDelta(deltaX, isOpen, isRightSide$$1) {
    return Math.max(0, (isOpen !== isRightSide$$1) ? -deltaX : deltaX);
}
const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-backdrop';
const MENU_CONTENT_OPEN = 'menu-content-open';
const GESTURE_BLOCKER = 'goback-swipe';

/**
 * baseAnimation
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
function baseAnimation(Animation) {
    // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves
    // "Apply the sharp curve to items temporarily leaving the screen that may return
    // from the same exit point. When they return, use the deceleration curve. On mobile,
    // this transition typically occurs over 300ms" -- MD Motion Guide
    return new Animation()
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)') // Deceleration curve (Entering the screen)
        .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)') // Sharp curve (Temporarily leaving the screen)
        .duration(300);
}

const BOX_SHADOW_WIDTH = 8;
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var MenuOverlayAnimation = function (Animation, _, menu) {
    let closedX, openedX;
    const width = menu.width + BOX_SHADOW_WIDTH;
    if (menu.isRightSide) {
        // right side
        closedX = width + 'px';
        openedX = '0px';
    }
    else {
        // left side
        closedX = -width + 'px';
        openedX = '0px';
    }
    const menuAni = new Animation()
        .addElement(menu.menuInnerEl)
        .fromTo('translateX', closedX, openedX);
    const backdropAni = new Animation()
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.3);
    return baseAnimation(Animation)
        .add(menuAni)
        .add(backdropAni);
};

/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var MenuPushAnimation = function (Animation, _, menu) {
    let contentOpenedX, menuClosedX;
    const width = menu.width;
    if (menu.isRightSide) {
        contentOpenedX = -width + 'px';
        menuClosedX = width + 'px';
    }
    else {
        contentOpenedX = width + 'px';
        menuClosedX = -width + 'px';
    }
    const menuAni = new Animation()
        .addElement(menu.menuInnerEl)
        .fromTo('translateX', menuClosedX, '0px');
    const contentAni = new Animation()
        .addElement(menu.contentEl)
        .fromTo('translateX', '0px', contentOpenedX);
    const backdropAni = new Animation()
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.2);
    return baseAnimation(Animation)
        .add(menuAni)
        .add(backdropAni)
        .add(contentAni);
};

/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var MenuRevealAnimation = function (Animation, _, menu) {
    const openedX = (menu.width * (menu.isRightSide ? -1 : 1)) + 'px';
    const contentOpen = new Animation()
        .addElement(menu.contentEl)
        .fromTo('translateX', '0px', openedX);
    return baseAnimation(Animation)
        .add(contentOpen);
};

class MenuController {
    constructor() {
        this.menus = [];
        this.menuAnimations = {};
        this.registerAnimation('reveal', MenuRevealAnimation);
        this.registerAnimation('push', MenuPushAnimation);
        this.registerAnimation('overlay', MenuOverlayAnimation);
    }
    /**
     * Programatically open the Menu.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu is fully opened
     */
    open(menuId) {
        const menu = this.get(menuId);
        if (menu && !this.isAnimating()) {
            let openedMenu = this.getOpen();
            if (openedMenu && menu !== openedMenu) {
                openedMenu.setOpen(false, false);
            }
            return menu.open();
        }
        return Promise.resolve(false);
    }
    /**
     * Programatically close the Menu. If no `menuId` is given as the first
     * argument then it'll close any menu which is open. If a `menuId`
     * is given then it'll close that exact menu.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu is fully closed
     */
    close(menuId) {
        const menu = (menuId)
            ? this.get(menuId)
            : this.getOpen();
        if (menu) {
            return menu.close();
        }
        return Promise.resolve(false);
    }
    /**
     * Toggle the menu. If it's closed, it will open, and if opened, it
     * will close.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu has been toggled
     */
    toggle(menuId) {
        const menu = this.get(menuId);
        if (menu && !this.isAnimating()) {
            var openedMenu = this.getOpen();
            if (openedMenu && menu !== openedMenu) {
                openedMenu.setOpen(false, false);
            }
            return menu.toggle();
        }
        return Promise.resolve(false);
    }
    /**
     * Used to enable or disable a menu. For example, there could be multiple
     * left menus, but only one of them should be able to be opened at the same
     * time. If there are multiple menus on the same side, then enabling one menu
     * will also automatically disable all the others that are on the same side.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {HTMLIonMenuElement}  Returns the instance of the menu, which is useful for chaining.
     */
    enable(shouldEnable, menuId) {
        const menu = this.get(menuId);
        if (menu) {
            menu.enabled = shouldEnable;
        }
        return menu;
    }
    /**
     * Used to enable or disable the ability to swipe open the menu.
     * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {HTMLIonMenuElement}  Returns the instance of the menu, which is useful for chaining.
     */
    swipeEnable(shouldEnable, menuId) {
        const menu = this.get(menuId);
        if (menu) {
            menu.swipeEnabled = shouldEnable;
        }
        return menu;
    }
    /**
     * @param {string} [menuId] Optionally get the menu by its id, or side.
     * @return {boolean} Returns true if the specified menu is currently open, otherwise false.
     * If the menuId is not specified, it returns true if ANY menu is currenly open.
     */
    isOpen(menuId) {
        if (menuId) {
            var menu = this.get(menuId);
            return menu && menu.isOpen() || false;
        }
        return !!this.getOpen();
    }
    /**
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {boolean} Returns true if the menu is currently enabled, otherwise false.
     */
    isEnabled(menuId) {
        const menu = this.get(menuId);
        if (menu) {
            return menu.enabled;
        }
        return false;
    }
    /**
     * Used to get a menu instance. If a `menuId` is not provided then it'll
     * return the first menu found. If a `menuId` is `left` or `right`, then
     * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
     * provided, then it'll try to find the menu using the menu's `id`
     * property. If a menu is not found then it'll return `null`.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {HTMLIonMenuElement} Returns the instance of the menu if found, otherwise `null`.
     */
    get(menuId) {
        var menu;
        if (menuId === 'left' || menuId === 'right') {
            // there could be more than one menu on the same side
            // so first try to get the enabled one
            menu = this.menus.find(m => m.side === menuId && m.enabled);
            if (menu) {
                return menu.getElement();
            }
            // didn't find a menu side that is enabled
            // so try to get the first menu side found
            return this.find(m => m.side === menuId) || null;
        }
        else if (menuId) {
            // the menuId was not left or right
            // so try to get the menu by its "id"
            return this.find(m => m.menuId === menuId) || null;
        }
        // return the first enabled menu
        menu = this.menus.find(m => m.enabled);
        if (menu) {
            return menu.getElement();
        }
        // get the first menu in the array, if one exists
        return (this.menus.length > 0 ? this.menus[0].getElement() : null);
    }
    /**
     * @return {Menu} Returns the instance of the menu already opened, otherwise `null`.
     */
    getOpen() {
        return this.find(m => m.isOpen());
    }
    /**
     * @return {Array<HTMLIonMenuElement>}  Returns an array of all menu instances.
     */
    getMenus() {
        return this.menus.map(menu => menu.getElement());
    }
    /**
     * @hidden
     * @return {boolean} if any menu is currently animating
     */
    isAnimating() {
        return this.menus.some(menu => menu.isAnimating);
    }
    /**
     * @hidden
     */
    _register(menu) {
        if (this.menus.indexOf(menu) < 0) {
            this.menus.push(menu);
        }
    }
    /**
     * @hidden
     */
    _unregister(menu) {
        const index = this.menus.indexOf(menu);
        if (index > -1) {
            this.menus.splice(index, 1);
        }
    }
    /**
     * @hidden
     */
    _setActiveMenu(menu) {
        // if this menu should be enabled
        // then find all the other menus on this same side
        // and automatically disable other same side menus
        const side = menu.side;
        this.menus
            .filter(m => m.side === side && m !== menu)
            .map(m => m.enabled = false);
    }
    /**
     * @hidden
     */
    createAnimation(type, menuCmp) {
        const animationBuilder = this.menuAnimations[type];
        return this.animationCtrl.create(animationBuilder, null, menuCmp);
    }
    registerAnimation(name, cls) {
        this.menuAnimations[name] = cls;
    }
    find(predicate) {
        const instance = this.menus.find(predicate);
        if (instance) {
            return instance.getElement();
        }
        return null;
    }
}

exports['ion-menu'] = Menu;
exports['ion-menu-controller'] = MenuController;
},


/***************** ion-menu *****************/
[
/** ion-menu: tag **/
"ion-menu",

/** ion-menu: members **/
[
  [ "close", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "config", /** prop context **/ 3, /** do not observe attribute **/ 0, /** type any **/ 1, /** context ***/ "config" ],
  [ "content", /** prop **/ 1, /** observe attribute **/ 1, /** type string **/ 2 ],
  [ "el", /** element ref **/ 7, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "enabled", /** prop mutable **/ 2, /** observe attribute **/ 1, /** type boolean **/ 3 ],
  [ "isOpen", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "lazyMenuCtrl", /** prop connect **/ 4, /** do not observe attribute **/ 0, /** type any **/ 1, /** context ***/ "ion-menu-controller" ],
  [ "maxEdgeStart", /** prop **/ 1, /** observe attribute **/ 1, /** type number **/ 4 ],
  [ "menuId", /** prop **/ 1, /** observe attribute **/ 1, /** type string **/ 2 ],
  [ "open", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "persistent", /** prop **/ 1, /** observe attribute **/ 1, /** type boolean **/ 3 ],
  [ "setOpen", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "side", /** prop **/ 1, /** observe attribute **/ 1, /** type any **/ 1 ],
  [ "swipeEnabled", /** prop **/ 1, /** observe attribute **/ 1, /** type boolean **/ 3 ],
  [ "toggle", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "type", /** prop mutable **/ 2, /** observe attribute **/ 1, /** type string **/ 2 ]
],

/** ion-menu: host **/
{"theme":"menu"},

/** ion-menu: events **/
[
  [
    /*****  ion-menu ionDrag ***** /
    /* event name ***/ "ionDrag"
  ],
  [
    /*****  ion-menu ionOpen ***** /
    /* event name ***/ "ionOpen"
  ],
  [
    /*****  ion-menu ionClose ***** /
    /* event name ***/ "ionClose"
  ]
],

/** ion-menu: propWillChanges **/
[
  [
    /*****  ion-menu prop will change [0] ***** /
    /* prop name **/ "type",
    /* call fn *****/ "typeChanged"
  ]
],

/** ion-menu: propDidChanges **/
[
  [
    /*****  ion-menu prop did change [0] ***** /
    /* prop name **/ "enabled",
    /* call fn *****/ "enabledChanged"
  ],
  [
    /*****  ion-menu prop did change [1] ***** /
    /* prop name **/ "side",
    /* call fn *****/ "sideChanged"
  ],
  [
    /*****  ion-menu prop did change [2] ***** /
    /* prop name **/ "swipeEnabled",
    /* call fn *****/ "swipeEnabledChanged"
  ]
]

],

/***************** ion-menu-controller *****************/
[
/** ion-menu-controller: tag **/
"ion-menu-controller",

/** ion-menu-controller: members **/
[
  [ "_register", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "_setActiveMenu", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "_unregister", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "animationCtrl", /** prop connect **/ 4, /** do not observe attribute **/ 0, /** type any **/ 1, /** context ***/ "ion-animation-controller" ],
  [ "close", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "createAnimation", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "enable", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "get", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "getMenus", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "getOpen", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "isAnimating", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "isEnabled", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "isOpen", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "open", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "swipeEnable", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "toggle", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ]
],

/** ion-menu-controller: host **/
{}

]
);