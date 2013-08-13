INSERT INTO `users_access_level_points` (`id`, `level_id`, `point_id`, `action`) VALUES 
(DEFAULT, 3, 34, 'view'),
(DEFAULT, 3, 34, 'edit'),

(DEFAULT, 3, 50, 'list'),
(DEFAULT, 3, 50, 'view'),
(DEFAULT, 3, 50, 'edit'),
(DEFAULT, 3, 50, 'file'),
(DEFAULT, 3, 50, 'delete'),
(DEFAULT, 3, 50, 'tags'),

(DEFAULT, 3, 51, 'new'),

(DEFAULT, 3, 60, 'list'),
(DEFAULT, 3, 60, 'view'),
(DEFAULT, 3, 60, 'edit'),
(DEFAULT, 3, 60, 'new'),
(DEFAULT, 3, 60, 'delete');


INSERT INTO `users` (`id`, `user_id`, `access_level_id`) VALUES 
('3', '2b44d0aa-325a-4fab-8832-6cc45f82b1df', 3);

INSERT INTO `basics_itemtypes` (`id`, `name`) VALUES
(1, 'photo');
