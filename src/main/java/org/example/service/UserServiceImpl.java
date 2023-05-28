package org.example.service;

import org.example.dao.UserDAOImpl;
import org.example.dto.UserDTO;
import org.example.dto.UserWithOrderDTO;
import org.example.mapper.UserMapper;
import org.example.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserDAOImpl userDAO;
    private final UserMapper userMapper;

    public UserServiceImpl(UserDAOImpl userDAO, UserMapper userMapper) {
        this.userMapper = userMapper;
        this.userDAO = userDAO;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> get() {
        return userMapper.userToUserDTOList(userDAO.getAll());
    }

    @Transactional
    @Override
    public UserDTO create(@Valid UserDTO userDTO) {
        User user = userMapper.userDTOToUser(userDTO);
        User createdUser = userDAO.create(user);
        return userMapper.userToUserDTO(createdUser);
    }

    @Transactional
    @Override
    public UserDTO update(@Valid UserDTO userDTO) {
        User user = userMapper.userDTOToUser(userDTO);
        userDAO.update(user);
        return userDTO;
    }

    @Transactional(readOnly = true)
    @Override
    public UserWithOrderDTO getById(UUID uuid) {
        User user = userDAO.getById(uuid);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id " + uuid + " was not found.");
        }
        return userMapper.userToUserWithOrderDTO(user);
    }

    @Transactional
    @Override
    public void delete(UUID uuid) {
        userDAO.delete(uuid);
    }
}
