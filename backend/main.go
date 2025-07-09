package main

import (
	"log"
	"regexp"

	"github.com/gofiber/fiber/v2"
)

type Control struct {
	ControlID   string `json:"controlId"`
	Category    string `json:"category"`
	Description string `json:"description"`
}

var controls []Control

func main() {
	app := fiber.New()

	app.Post("/submit", func(c *fiber.Ctx) error {
		var control Control

		if err := c.BodyParser(&control); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}

		if control.ControlID == "" || control.Category == "" || control.Description == "" {
			return c.Status(400).JSON(fiber.Map{"error": "All fields are required"})
		}
		var controlIdRegex = regexp.MustCompile(`^CTRL-\d{3}$`)
		if !controlIdRegex.MatchString(control.ControlID) {
			return c.Status(400).JSON(fiber.Map{"error": "Control ID must be format CTRL-XXX"})
		}
		if len(control.Description) < 10 || len(control.Description) > 500 {
			return c.Status(400).JSON(fiber.Map{"error": "Description must be 10-500 characters"})
		}
		validCategories := map[string]bool{
			"Access Control":  true,
			"Data Protection": true,
			"Monitoring":      true,
		}
		if !validCategories[control.Category] {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid category"})
		}

		controls = append(controls, control)

		return c.JSON(fiber.Map{"message": "Submission successful", "deletedControl": control})
	})

	app.Get("/controls", func(c *fiber.Ctx) error {
		return c.JSON(controls)
	})

	app.Put("/controls/:id", func(c *fiber.Ctx) error {
		controlId := c.Params("id")
		var updatedControl Control

		if err := c.BodyParser(&updatedControl); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}

		if updatedControl.ControlID == "" || updatedControl.Category == "" || updatedControl.Description == "" {
			return c.Status(400).JSON(fiber.Map{"error": "All fields are required"})
		}
		controlIdRegex := regexp.MustCompile(`^CTRL-\d{3}$`)
		if !controlIdRegex.MatchString(updatedControl.ControlID) {
			return c.Status(400).JSON(fiber.Map{"error": "Control ID must be format CTRL-XXX"})
		}
		if len(updatedControl.Description) < 10 || len(updatedControl.Description) > 500 {
			return c.Status(400).JSON(fiber.Map{"error": "Description must be 10-500 characters"})
		}
		validCategories := map[string]bool{
			"Access Control":  true,
			"Data Protection": true,
			"Monitoring":      true,
		}
		if !validCategories[updatedControl.Category] {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid category"})
		}

		for i, control := range controls {
			if control.ControlID == controlId {
				controls[i] = updatedControl

				return c.JSON(fiber.Map{"message": "Control updated successfully", "updatedControl": updatedControl})
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Control not found"})

	})

	app.Delete("/controls/:id", func(c *fiber.Ctx) error {
		controlId := c.Params("id")

		for i, control := range controls {
			if controlId == control.ControlID {
				deletedControl := controls[i]
				controls = append(controls[:i], controls[i+1:]...)

				return c.JSON(fiber.Map{"message": "Control deleted successfully", "control": deletedControl})
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Control not found"})
	})

	if err := app.Listen(":3000"); err != nil {
		log.Fatal(err)
	}
}
