(function () {
   'use strict';

   /**
    * Custom pagination component
    */
   CoreLibrary.CustomPaginationComponent = CoreLibrary.Component.subclass({
      htmlTemplate: '' +
      '<div class="kw-scroll-left l-flexbox l-align-center" rv-on-click="previousPage"><i class="icon-angle-left"></i></div>' +
      '<div class="kw-scroll-container kw-gradient">' +
      '<div id="kw-scroll-component" class="kw-pagination kw-scroll-inner l-flexbox l-pack-justify l-flex-1 l-align-stretch">' +
      '<span rv-each-page="pages" rv-on-click="page.clickEvent" rv-class-kw-active-page="page.selected"' +
      'class="KambiWidget-card-border-color kw-page-link l-flexbox l-pack-center l-align-center l-flex-1">' +
      '<span class="KambiWidget-primary-background-color kw-custom-border"></span>' +
      '{page.text}' +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="kw-scroll-right l-flexbox l-align-center l-pack-end" rv-on-click="nextPage"><i class="icon-angle-right"></i></div>',
      constructor ( htmlElement, mainComponentScope, scopeKey, pageSize, maxVisiblePages ) {
         CoreLibrary.Component.apply(this, [{
            rootElement: htmlElement
         }]);
         this.pageSize = pageSize ? pageSize : 3;
         this.maxVisiblePages = maxVisiblePages ? maxVisiblePages : 5;
         this.maxVisibleTabs = 6;
         this.scope.currentPage = 0;
         this.scope.firstPage = true;
         this.scope.lastPage = false;
         this.scrollStart = 0;
         this.start = true;
         this.scrollerContainer = document.getElementById('pagination');

         /*
          creates a new array with name _scopeKey
          the component should use this array when it wants only the data
          of the currentPage
          */
         mainComponentScope['_' + scopeKey] = [];
         this.originalArray = mainComponentScope[scopeKey];
         this.currentPageArray = mainComponentScope['_' + scopeKey];

         // watching for changes in the original array
         sightglass(mainComponentScope, scopeKey, function () {
            this.originalArray = mainComponentScope[scopeKey];
            this.setCurrentPage(0);
            this.clearArray();
            this.adaptArray();
         }.bind(this));

         this.scope.nextPage = this.nextPage.bind(this);
         this.scope.previousPage = this.previousPage.bind(this);

         this.adaptArray();
         this.handleClass('left', true);
      },

      clearArray: function () {
         this.currentPageArray.splice(0, this.currentPageArray.length);
      },

      /**
       * Returns current page
       * @returns {number|*}
       */
      getCurrentPage () {
         return this.scope.currentPage;
      },

      /**
       * Sets current page number
       * @param pageNumber
       */
      setCurrentPage ( pageNumber ) {
         if ( pageNumber === this.getCurrentPage() ) {
            return;
         }
         if ( pageNumber < 0 || pageNumber >= this.getNumberOfPages() ) {
            throw new Error('Invalid page number');
         }
         this.scope.currentPage = pageNumber;
         this.adaptArray();
      },

      setCurrentPageOnCLick ( pageNumber ) {
         this.doScroll(null, pageNumber);
         this.setCurrentPage(pageNumber);
      },

      /**
       * Return the number of pages based on limit set
       * @returns {number}
       */
      getNumberOfPages () {
         return Math.ceil(this.originalArray.length / this.pageSize);
      },

      /**
       * Changes the _scopeKey array to match the current page elements
       */
      adaptArray () {
         this.clearArray();
         var startItem = this.getCurrentPage() * this.pageSize;
         var endItem = startItem + this.pageSize;
         if ( endItem >= this.originalArray.length ) {
            endItem = this.originalArray.length;
         }
         for ( var i = startItem; i < endItem; ++i ) {
            this.currentPageArray.push(this.originalArray[i]);
         }

         this.scope.firstPage = this.getCurrentPage() === 0;
         this.scope.lastPage = this.getCurrentPage() === this.getNumberOfPages() - 1;

         this.render();
      },

      handleClass ( dir, end ) {
         this.scrollerContainer.classList.remove('kw-gradient-right');
         this.scrollerContainer.classList.remove('kw-gradient-left');
         if ( dir === 'right' && end ) {
            this.scrollerContainer.classList.add('kw-gradient-right');
         } else if ( dir === 'left' && end ) {
            this.scrollerContainer.classList.add('kw-gradient-left');
         }
      },

      getScroller () {
         this.scroller = document.getElementById('kw-scroll-component');
         this.scrollerParent = this.scroller.parentElement;
         this.scrollerParentWidth = this.scrollerParent.offsetWidth;
         this.items = this.scroller.querySelectorAll('.kw-page-link');
         this.itemWidth = this.items.length ? this.items[0].offsetWidth : 0;
         this.scrollerWidth = this.itemWidth * this.items.length;
      },

      doScroll ( dir, index ) {
         this.getScroller();
         this.handleClass();

         if ( dir === 'left' ) {
            this.scrollStart += this.itemWidth;
         } else if ( index >= 0 ) {
            if ( index < this.getCurrentPage() + 1 ) {
               this.scrollStart = index * -1 * 0.5 * this.itemWidth;
            } else {
               this.scrollStart = index * -1 * this.itemWidth;
            }
         } else {
            this.scrollStart -= this.itemWidth;
         }

         if ( this.scrollStart >= 0 ) {
            this.scrollStart = 0;
         }
         if ( (this.scrollStart * -1) >= (this.scrollerWidth - this.scrollerParentWidth) ) {
            this.scrollStart = (this.scrollerWidth - this.scrollerParentWidth) * -1;
         }
         if ( index >= 0 ) {
            if ( index === 0 ) {
               dir = 'left';
            } else if ( index === this.getNumberOfPages() - 1 ) {
               dir = 'right';
            }
         }
         this.handleClass(dir, true);
         this.doTranslate();
      },

      /**
       * Method for displaying next page.
       * @returns {*|number}
       */
      nextPage () {
         if ( this.getCurrentPage() < this.getNumberOfPages() - 1 ) {
            this.setCurrentPage(this.getCurrentPage() + 1);
            this.doScroll('right');
         }
         return this.getCurrentPage();
      },

      /**
       * Method for displaying previous page.
       * @returns {*|number}
       */
      previousPage () {
         if ( this.getCurrentPage() > 0 ) {
            this.setCurrentPage(this.getCurrentPage() - 1);
            this.doScroll('left');
         }
         return this.getCurrentPage();
      },

      doTranslate ( coordX ) {
         this.scrollStart = (coordX >= 0 ? coordX : this.scrollStart);
         var translate = 'translate3d(' + this.scrollStart + 'px, 0, 0)';
         this.scroller.style.transform = translate;
         this.scroller.style.webkitTransform = translate;
         this.scroller.style.MozTransform = translate;
      },

      /**
       *  Renders the component at init
       */
      init () {
         this.render();
      },

      /**
       * Updates the scope.pages value which is used to render the page numbers and arrows
       */
      render () {
         this.scope.pages = [];
         var maxVisiblePages = this.maxVisiblePages,
            currentPage = this.getCurrentPage(),
            pageCount = this.getNumberOfPages(),
            startPage = 0,
            endPage = pageCount;

         if ( maxVisiblePages < pageCount ) {
            // Keep active page in middle by adjusting start and end
            startPage = Math.max(currentPage - Math.ceil(maxVisiblePages / 3), 0);
            endPage = startPage + maxVisiblePages;
            // Shift the list start and end
            if ( endPage > pageCount ) {
               endPage = pageCount;
               startPage = endPage - maxVisiblePages;
            }
         }

         for ( var i = startPage; i <= endPage - 1; i++ ) {
            this.scope.pages.push({
               text: this.originalArray[i].groupName,
               number: i,
               selected: i === this.getCurrentPage(),
               clickEvent: this.setCurrentPageOnCLick.bind(this, i) // calls setCurrentPage with i as a parameter
            });
         }
      }
   });

})();
