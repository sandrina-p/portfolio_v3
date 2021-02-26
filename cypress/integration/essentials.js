import valuesData from '../../src/data/values.js';

/** 
NOTES:

1. These tests only cover the essential content and functionality.
But I'll keep relying heavily on manual testing
because of all the animations around.

2. I know asserting by .class is a bad practice, but probably this will
  never change... It's a portfolio, not a famous app with daily releases.
*/

function assertMenuCurrent(i, text) {
  // Use .scrollIntoView(), so Nav can update correctly based on window.scrollY

  cy.log('Assert Menu status');
  cy.get('nav.nav').within(() => {
    cy.get('ul>li').should('have.length', 5);
    cy.get('ul>li')
      .eq(i)
      .should('have.class', 'isCurrent')
      .and('contain', text);
  });
}

function assertLink(cyEl, text, link) {
  cyEl
    .should('contain', text)
    .and('have.attr', 'href')
    .and('contains', link);
}

describe('Essentials', () => {
  it('Intro', () => {
    cy.visit('/');

    // It loads on a tablet viewport, so jsMotionReduced should be there.
    cy.get('body').should('have.class', 'jsMotionReduced jsMotionInitial');

    cy.get('#intro').within(() => {
      cy.get('h1').should('contain', "Hi, it's Sandrina");
      cy.get('p').should(
        'contain',
        "I'm a UX Engineer who helps to turn ideas into accessible experiences."
      );
    });

    cy.log('Wait for page to finish loading');
    cy.get('body').should('have.class', 'jsGoOn');
  });

  it('Menu', () => {
    cy.get('nav.nav').within(() => {
      cy.get('button.burgerBtn').click();
      // Don't assert theme status because CI is diff from locally
      cy.get('button.toggleTheme').should('have.attr', 'aria-pressed');
      cy.get('button.toggleTheme').should('have.attr', 'aria-label', 'Dark Theme');

      // togglMotion is true by default on tablet
      cy.get('button.toggleMotion').should('have.attr', 'aria-pressed', 'true');

      // Assert menu count
      cy.get('ul>li').should('have.length', 5);

      // close menu
      cy.get('button.burgerBtn')
        .click()
        .should('have.attr', 'aria-pressed', 'false');
    });
  });

  it('Values', () => {
    cy.getByDT('valuesV').scrollIntoView();
    cy.getByDT('valuesV').within(() => {
      // Make sure there's a visual hidden title.
      cy.get('h2')
        .should('have.class', 'sr-only')
        .should('contain', 'Values');

      cy.log('::: Assert Dots');
      cy.getByDT('dots')
        .scrollIntoView()
        .within(() => {
          cy.get('h3').should('contain', "Let's connect the dots");
          // No need to assert it all... just make sure it starts well.
          cy.get('p').should('contain', 'Combining design and development proce');
        });

      cy.log('::: Assert Ask');
      cy.getByDT('ask')
        .scrollIntoView()
        .within(() => {
          cy.get('h3').should('contain', 'Ask why Understand how');
          cy.get('p').should('contain', 'Clear understanding and open communication are fun');
        });

      cy.log('::: Assert Wolf');
      cy.getByDT('wolf')
        .scrollIntoView()
        .within(() => {
          cy.get('h3')
            .invoke('text')
            .should('contain', 'From a solo act')
            .should('contain', 'to a team player');
          cy.get('p').should('contain', 'If you wanna go quickly, I can');
        });

      cy.log('::: Assert People');
      cy.getByDT('people')
        .scrollIntoView()
        .within(() => {
          cy.get('h3').should('contain', 'Progress over processes');
          cy.get('p').should('contain', 'I find myself in a constant search for dis');
        });
    });
  });

  it('Words', () => {
    cy.getByDT('words').scrollIntoView();
    assertMenuCurrent(1, 'words');

    cy.getByDT('words').within(() => {
      cy.log('::: Assert header');
      cy.get('header').within(() => {
        cy.get('h2').should('contain', "I've been sharing");
        cy.get('p').should(
          'contain',
          'As a self-taught developer, giving back to the community is a joy!'
        );
      });

      cy.log('::: Assert list of cards and 1º card');
      cy.getByDT('cards', 'ul')
        .children()
        .should('have.length', 4)
        // assert just the first card.
        //there's a 99.9%% change all the rest is right because this is a loop.
        .eq(0)
        .within(() => {
          cy.get('h3').should('contain', 'Remote Workshops');

          cy.get('.date').should('contain', 'Date: 2021');

          // Assert links
          cy.get('ul > li')
            .should('have.length', 2)
            .eq(0)
            .within(() => {
              cy.get('.placeType').should('contain', '9h workshop');
              cy.get('.placeIcon').should('have.class', 'bulb');
              cy.get('a')
                .should('contain', 'Web Accessibility Fundamentals')
                .and('have.attr', 'href')
                .and('contain', '/workshop-a11y-fundamentals');
            });
        });
    });
  });

  it('Skills', () => {
    cy.getByDT('skills').scrollIntoView();

    assertMenuCurrent(2, 'skills');

    cy.getByDT('skills').within(() => {
      cy.log('::: Assert header');
      cy.get('header').within(() => {
        cy.get('h2').should('contain', 'skills');
        cy.get('p')
          .should('contain', 'Take a sneak peek on Github and Codepen')
          .find('a')
          .should('have.length', 2); // has 2 links (Github and Codepen)
      });
      cy.get('.tabList').should('not.be.visible');

      cy.log('::: Assert 1º set of skills - rocking at');
      cy.get('ul.skills > li.skillsLvl')
        .should('have.length', 4)
        .eq(0)
        .within(() => {
          cy.get('h3').should('contain', 'rocking at');
          cy.get('ul>li.point')
            .should('have.length.of.at.least', 5)
            .eq(0)
            .should('contain', 'React');
        });
    });
  });

  it('Journey', () => {
    cy.getByDT('journey').scrollIntoView();

    assertMenuCurrent(3, 'journey');

    cy.getByDT('journey').within(() => {
      cy.get('h2')
        // Not pretty... but what else could I do?
        .should('contain', 'Uff,')
        .should('contain', 'you came so far...')
        .should('contain', "Here's my journey");

      cy.get('.text').within(() => {
        cy.get('p').should('have.length', 3);
        cy.get('a').should('have.length', 6);

        assertLink(cy.get('a').eq(0), 'Remote', 'https://remote.com/');
        assertLink(cy.get('a').eq(1), 'Group Income', 'group-income-simple');
        assertLink(cy.get('a').eq(2), 'Farfetch', 'farfetch.com');
        assertLink(cy.get('a').eq(4), 'pushing pixels around', 'codepen.io');
        assertLink(cy.get('a').eq(5), 'share ideas', 'twitter.com');
        // assertLink(cy.get('a').eq(5), 'get in touch', 'mailto:');
      });
    });
  });

  it('Contact', () => {
    cy.getByDT('contact').scrollIntoView();

    assertMenuCurrent(4, 'contact');

    cy.getByDT('contact').within(() => {
      cy.get('h3')
        .should('contain', 'Well...')
        .should('contain', "That's all for now!");

      cy.get('.card').within(() => {
        cy.get('p')
          .eq(0)
          .should('contain', 'Feel free to say hi');

        cy.get('p')
          .eq(1)
          .should('contain', "It's easy to find me around, specially if you are a web lover too.");

        cy.get('a').should('have.length', 5);

        assertLink(cy.get('a').eq(0), 'dev.to', 'dev.to');
        assertLink(cy.get('a').eq(1), 'codepen', 'codepen.io');
        assertLink(cy.get('a').eq(2), 'twitter', 'twitter.com');
        assertLink(cy.get('a').eq(3), 'e-mail', 'mailto:');
        assertLink(cy.get('a').eq(4), 'Code', 'portfolio_v3');

        cy.get('.credits')
          .invoke('text')
          .should('contain', 'Made without coffee.');
      });
    });

    cy.log('Verify that nav through menu works');

    cy.get('nav.nav').within(() => {
      // Open menu
      cy.get('button.burgerBtn').should('have.attr', 'aria-pressed', 'false');
      cy.get('button.burgerBtn').click();

      cy.log('Go to "words"');
      cy.get('ul>li')
        .eq(1)
        .and('contain', 'words')
        .find('a')
        .click();
    });

    // Menu gets closed when navigating through sections.
    assertMenuCurrent(1, 'words');
  });
});
