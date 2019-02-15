
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('images').del()
    .then(function () {
      // Inserts seed entries
      return knex('images').insert([
        { id: 1, author: 'Jason Chan', link: 'https://i.kinja-img.com/gawker-media/image/upload/s--K9UKXVVO--/c_scale,f_auto,fl_progressive,q_80,w_800/18bltht3ayrfyjpg.jpg', description: 'Pact of Negation - Showing off contrasting colors and a vivid interpretation of nothing in particular happening (the card is a counterspell that simply prevents another spell from resolving).' },
        { id: 2, author: 'Greg Staples', link: 'https://i.kinja-img.com/gawker-media/image/upload/s--Q0xRFwmh--/c_scale,f_auto,fl_progressive,q_80,w_800/18bltf0gr81pujpg.jpg', description: 'Baneslayer Angel - Pseudo-realism used for a gorgeous, almost Impressionist angel. This card is one of the most powerful creatures in Magic, and at one time cost almost $60...while it was still in print.' },
        { id: 3, author: 'Kev Walker', link: 'https://i.kinja-img.com/gawker-media/image/upload/s--U7o_Y_qf--/c_scale,f_auto,fl_progressive,q_80,w_800/18bluok3ki70ejpg.jpg', description: 'Damnation - There are a lot of Magic cards that destroy things en masse, and a lot of ways to depict that. Damnation\'s sucking black void is the most unnerving to look at, though.' },
        { id: 4, author: 'Stephan Martiniere', link: 'https://i.kinja-img.com/gawker-media/image/upload/s--hlKCPhSK--/c_scale,f_auto,fl_progressive,q_80,w_800/18blth9cy3yy7jpg.jpg', description: 'Ravnica Island - Another stunning basic land from Martiniere. The level of detail is mind-blowing.' },
        { id: 5, author: 'Aleksi Briclot', link: 'https://i.kinja-img.com/gawker-media/image/upload/s--zx0RxOwV--/c_scale,f_auto,fl_progressive,q_80,w_800/18bltj0i46jkrjpg.jpg', description: 'Tombstalker - Briclot\'s design for this demon is incredible, but what makes this one of my favorite pieces of Magic art is the dynamic sense of movement.' },
      ]);
    });
};
