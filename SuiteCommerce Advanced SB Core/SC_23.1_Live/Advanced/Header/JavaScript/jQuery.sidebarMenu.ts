/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="jQuery.sidebarMenu"/>

import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';

function Menu(el) {
    const parent = el.parent();
    const wrapper = el;
    let last_opened_menu = wrapper;
    const root_ul = wrapper.find('.header-sidebar-menu:first');
    let animating = false;
    const has_animation_support = detectAnimationSupport();
    const class_names = {
        menuOpened: 'header-sidebar-menu-opened',
        menuPath: 'header-sidebar-menu-path',
        menuTransition: 'header-sidebar-menu-transition',
        animateIn: 'header-sidebar-menu-flyer-in',
        animateOut: 'header-sidebar-menu-flyer-out',
        flyer: 'header-sidebar-menu-flyer'
    };
    const height_stack = [];

    // initializing menu
    last_opened_menu.addClass(class_names.menuPath);
    last_opened_menu.addClass(class_names.menuOpened);

    jQuery(root_ul).on('click', '[data-action="push-menu"]', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (animating === true) {
            return;
        }
        animating = true;

        const anchor = jQuery(this);
        const parent_li = anchor.closest('li');
        const pushing_menu = anchor.next();

        animate(pushing_menu, class_names.animateIn, function() {
            // change the last opened menu.
            last_opened_menu.removeClass(class_names.menuOpened);
            last_opened_menu.find('a').each(function() {
                jQuery(this).attr('aria-disabled', 'true');
            });
            last_opened_menu = parent_li;

            // add current opened subview
            parent_li.addClass(class_names.menuPath).addClass(class_names.menuOpened);
            parent_li.find('a').each(function() {
                jQuery(this).removeAttr('aria-disabled');
            });
            addTrapFocusListener(parent);
        });
    });

    jQuery(root_ul).on('click', '[data-action="pop-menu"]', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (animating === true) {
            return;
        }
        animating = true;

        const anchor = jQuery(this); // anchor is the back button
        const anchor_menu = anchor.closest('ul');
        const opened_li = anchor.closest('.' + class_names.menuOpened);

        opened_li.removeClass(class_names.menuPath).removeClass(class_names.menuOpened);

        last_opened_menu = opened_li.closest('.' + class_names.menuPath);
        last_opened_menu.addClass(class_names.menuOpened);
        last_opened_menu.find('a').each(function() {
            jQuery(this).removeAttr('aria-disabled');
        });
        opened_li.find('a').each(function() {
            jQuery(this).attr('aria-disabled', 'true');
        });
        animate(anchor_menu, class_names.animateOut);
    });

    const flyer_className = '.' + class_names.flyer;
    jQuery(wrapper).on(
        'animationend MSAnimationEnd oAnimationEnd webkitAnimationEnd',
        flyer_className,
        function() {
            const cb = jQuery(this).data('callback');
            if (cb) {
                cb();
            }

            jQuery(this).remove();
            animating = false;
            root_ul.addClass(class_names.menuTransition); // fix ios transition glitch
        }
    );

    addTrapFocusListener(parent);

    function animate(sub_menu, animation_class, cb?) {
        const flyer_menu = sub_menu.clone(false);

        flyer_menu
            .removeClass()
            .addClass(class_names.flyer)
            .insertAfter(root_ul)
            .addClass(animation_class);

        if (animation_class === class_names.animateIn) {
            height_stack.push(root_ul.height());
            root_ul.css('height', flyer_menu.height());
        } else {
            root_ul.css('height', height_stack.pop());
        }

        flyer_menu.data('callback', cb);

        if (!has_animation_support) {
            if (cb) {
                cb();
            }
            flyer_menu.remove();
            animating = false;
            root_ul.addClass(class_names.menuTransition); // fix ios transition glitch
        }
    }
}

function addTrapFocusListener(element: HTMLElement): void {
    const focusableElements = jQuery(element).find(
        'a[href]:not([disabled]):not([aria-disabled]), button:not([disabled]):not([aria-disabled]), textarea:not([disabled]):not([aria-disabled]), input:not([disabled]):not([aria-disabled]), select:not([disabled]):not([aria-disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocus = (e): void => {
        const isTabPressed = e.key === 'Tab';

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    };

    jQuery(element).off('keydown', trapFocus);
    jQuery(element).on('keydown', trapFocus);
}

function detectAnimationSupport(): boolean {
    const domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
    const elm = document.createElement('div');

    if (elm.style.animationName !== undefined) {
        return true;
    }

    for (let i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
            return true;
        }
    }

    return false;
}

(<any>jQuery.fn).sidebarMenu = function() {
    return this.each(function() {
        Menu(jQuery(this));
    });
};

export = (<any>jQuery.fn).sidebarMenu;
