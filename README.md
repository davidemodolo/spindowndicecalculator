# Spindown Dice Calculator - The Binding of Isaac: Repentace

Public repository for the Spindown Dice calculator webapp available [here](https://spindowndicecalculator.web.app).

**IMPORTANT**: searching for Dad's Note in the second panel will show the generable items, but of course that's not correct. For now it will remain like this for debugging purposes, but I'll fix it as soon as possible.

## Idea

I hope it's self-explanatory enough once opened, but not having even half a skill in the field of interfaces and user experience, I'll play it safe.

### Car Battery

Let's start with the "**Car Battery**" section: by clicking on the panel, you can activate/deactivate the item, which will halve the calculation of spins but, more importantly, will alert you in case the item you are looking for is skipped due to **Car Battery**.

Practical examples:

- If we have **Candy Heart** and want to reach **Card Reading**, with **Car Battery** activated, the site will notify you that it won't be possible to reach it.

- Similarly, if we have **Candy Heart** and want to reach **Quints**, the site warns us that we would encounter **Dad's Note** after 3 spins (stopping the spinning process), but if **Car Battery** is activated, we can dodge **Dad's Note** and reach **Quints** in 4 spins.

### First Panel

The first panel requires two items. By pressing the `Show` button, the number of spins needed to go from the first item to the second one will be displayed, if possible.

As explained above, we also have full integration with **Car Battery** and **Dad's Note**.

### Second Panel

In the second panel, we have a single search text and a slider.

By entering the name of an item, we will see (on the left) the chain of items that would appear by spinning the selected one (up to **The Sad Onion** or **Dad's Note**), while on the right, we will see the items that, after `X` spins, can lead us to the desired one (again, the presence of **Dad's Note** down the path will be notified if it's necessary).

Additionally, using the _slider_ (which has an ugly style, sorry), you can choose how many "generable" and "generator" items to display, from a minimum of 5 to a maximum of 100. In this case as well, we have all the interactions with **Car Battery** and **Dad's Note**.

Last but not least: once an item is entered in this second panel, a second search field will appear. By entering a specific item, it will take you to the point where that item is present in one of the two lists (if present) and highlight it in green.

Practical examples:

- I want **Placebo**, so I enter it in the search field. On the left, I can see that, for example, after one spin, it becomes **Diplopia**, while on the right, I can see which items would generate **Placebo** and in how many spins. For example, spinning **Toxic Shock** twice would give **Placebo**.
  
- I want **Placebo**, and I have three items in front of me in-game: I set the slider to 100, enter Placebo in the first search field, and using the second search field, I start looking for the items I have in-game. Of course, if there's only one item in-game, it's faster to use the functionality of the first "panel," but with more items in front of you in-game, it might be more convenient to use this second functionality. In any case, the more options, the better; no one forces you to use anything.

## Credits
Special thanks to:

 - [Michele Biena](https://github.com/MicheleBiena) aka TrainerFromHoenn on [Twitch](https://www.twitch.tv/trainerfromhoenn)

## TODO

- [ ] Change slider style
- [ ] Make the "Scroll up" button prettier
- [ ] Finally, fix the Dad's Note item generation in the second panel
